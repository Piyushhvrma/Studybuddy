const LearningEntry = require("../models/LearningEntry.model");
const Note = require("../models/Note.model");
const Folder = require("../models/Folder.model");
const Material = require("../models/Material.model");
const mongoose = require("mongoose");

// @route GET /api/analytics/overview
const getOverview = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);

    // 1. Entries per day (last 30 days) - for activity line chart
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
    const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split("T")[0];

    const dailyActivity = await LearningEntry.aggregate([
      { $match: { userId, date: { $gte: thirtyDaysAgoStr } } },
      { $group: { _id: "$date", count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    // 2. Notes per folder - for pie/bar chart
    const folders = await Folder.find({ userId: req.userId });
    const notesByFolder = await Promise.all(
      folders.map(async (folder) => {
        const count = await Note.countDocuments({ folderId: folder._id });
        return { name: folder.folderName, value: count };
      })
    );

    // 3. Entries per weekday - for bar chart (which days are most productive)
    const allEntries = await LearningEntry.find({ userId: req.userId }).select("date");
    const weekdayCounts = [0, 0, 0, 0, 0, 0, 0]; // Sun-Sat
    const weekdayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    allEntries.forEach((entry) => {
      const day = new Date(entry.date + "T00:00:00").getDay();
      weekdayCounts[day]++;
    });
    const entriesByWeekday = weekdayNames.map((name, i) => ({ name, count: weekdayCounts[i] }));

    // 4. Materials by file type - for pie chart
    const materialTypes = await Material.aggregate([
      { $match: { userId } },
      { $group: { _id: "$fileType", count: { $sum: 1 } } },
    ]);
    const materialsByType = materialTypes.map((m) => ({ name: m._id.toUpperCase(), value: m.count }));

    // 5. Monthly entry counts (last 6 months) - for trend chart
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    const sixMonthsAgoStr = sixMonthsAgo.toISOString().split("T")[0];

    const monthlyRaw = await LearningEntry.aggregate([
      { $match: { userId, date: { $gte: sixMonthsAgoStr } } },
      {
        $group: {
          _id: { $substr: ["$date", 0, 7] }, // YYYY-MM
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyTrend = monthlyRaw.map((m) => {
      const [year, month] = m._id.split("-");
      return { name: `${monthNames[parseInt(month) - 1]} ${year}`, count: m.count };
    });

    // 6. Totals summary
    const totalEntries = allEntries.length;
    const totalNotes = await Note.countDocuments({ userId: req.userId });
    const totalMaterials = await Material.countDocuments({ userId: req.userId });
    const totalFolders = folders.length;

    // Average entries per active day
    const activeDays = new Set(allEntries.map((e) => e.date)).size;
    const avgPerActiveDay = activeDays > 0 ? (totalEntries / activeDays).toFixed(1) : 0;

    res.json({
      dailyActivity,
      notesByFolder,
      entriesByWeekday,
      materialsByType,
      monthlyTrend,
      summary: {
        totalEntries,
        totalNotes,
        totalMaterials,
        totalFolders,
        activeDays,
        avgPerActiveDay,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { getOverview };