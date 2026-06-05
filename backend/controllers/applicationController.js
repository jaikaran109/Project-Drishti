const Application = require("../models/Application");
const {
  normalizeString,
  isAllowedReportName,
  isValidDateInput,
  isValidTimeInput,
} = require("../utils/validators");

const formatDate = (value) => {
  if (!value) {
    return "";
  }

  return new Date(value).toISOString().slice(0, 10);
};

const serializeApplication = (application) => {
  return {
    id: application._id.toString(),
    patientName: application.patientName,
    phone: application.phone,
    problem: application.problem,
    details: application.details,
    previousTreatment: application.previousTreatment,
    reportName: application.reportName,
    status: application.status,
    createdAt: formatDate(application.createdAt),
    appointmentDate: application.appointmentDate,
    appointmentTime: application.appointmentTime,
    queueNumber: application.queueNumber,
    rejectReason: application.rejectReason,
  };
};

const getApplications = async (req, res, next) => {
  try {
    const filter = req.user.role === "admin" ? {} : { user: req.user._id };
    const applications = await Application.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      applications: applications.map(serializeApplication),
    });
  } catch (error) {
    next(error);
  }
};

const createApplication = async (req, res, next) => {
  try {
    const { problem, details, previousTreatment, reportName } = req.body;
    const normalizedProblem = normalizeString(problem);
    const normalizedDetails = normalizeString(details);
    const normalizedPreviousTreatment = normalizeString(previousTreatment);
    const normalizedReportName = normalizeString(reportName);

    if (!normalizedProblem || !normalizedDetails) {
      return res.status(400).json({
        message: "Problem and medical details are required",
      });
    }

    if (normalizedProblem.length < 3) {
      return res.status(400).json({
        message: "Problem or symptoms must be at least 3 characters long",
      });
    }

    if (normalizedDetails.length < 10) {
      return res.status(400).json({
        message: "Medical issue details must be at least 10 characters long",
      });
    }

    if (!isAllowedReportName(normalizedReportName)) {
      return res.status(400).json({
        message: "Medical report must be a PDF, JPG, JPEG, or PNG file",
      });
    }

    const application = await Application.create({
      user: req.user._id,
      patientName: req.user.fullName,
      phone: req.user.phoneNumber,
      problem: normalizedProblem,
      details: normalizedDetails,
      previousTreatment: normalizedPreviousTreatment || "",
      reportName: normalizedReportName || "",
      status: "pending",
    });

    return res.status(201).json({
      message: "Application submitted successfully",
      application: serializeApplication(application),
    });
  } catch (error) {
    next(error);
  }
};

const updateApplication = async (req, res, next) => {
  try {
    const {
      status,
      appointmentDate,
      appointmentTime,
      queueNumber,
      rejectReason,
    } = req.body;
    const normalizedStatus = normalizeString(status)?.toLowerCase();

    if (!normalizedStatus || !["pending", "approved", "rejected"].includes(normalizedStatus)) {
      return res.status(400).json({
        message: "A valid status is required",
      });
    }

    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    application.status = normalizedStatus;

    if (normalizedStatus === "approved") {
      const parsedQueueNumber = Number(queueNumber);

      if (
        !isValidDateInput(appointmentDate) ||
        !isValidTimeInput(appointmentTime) ||
        !Number.isInteger(parsedQueueNumber) ||
        parsedQueueNumber <= 0
      ) {
        return res.status(400).json({
          message:
            "Use a valid appointment date, time, and queue number for approval",
        });
      }

      const hasQueueConflict = await Application.exists({
        _id: { $ne: application._id },
        status: "approved",
        appointmentDate,
        queueNumber: parsedQueueNumber,
      });

      if (hasQueueConflict) {
        return res.status(409).json({
          message: "That queue number is already assigned for the selected date",
        });
      }

      application.appointmentDate = appointmentDate.trim();
      application.appointmentTime = appointmentTime.trim();
      application.queueNumber = parsedQueueNumber;
      application.rejectReason = "";
    }

    if (normalizedStatus === "rejected") {
      application.rejectReason = normalizeString(rejectReason) || "Not specified";
      application.appointmentDate = "";
      application.appointmentTime = "";
      application.queueNumber = undefined;
    }

    if (normalizedStatus === "pending") {
      application.appointmentDate = "";
      application.appointmentTime = "";
      application.queueNumber = undefined;
      application.rejectReason = "";
    }

    await application.save();

    return res.status(200).json({
      message: "Application updated successfully",
      application: serializeApplication(application),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getApplications,
  createApplication,
  updateApplication,
};
