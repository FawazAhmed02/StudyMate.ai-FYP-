const Quiz = require("../models/Quiz");

exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.params.userId; // Extract userId from URL parameters
    console.log("Received userId: ", userId);

    // Fetch data from MongoDB
    const quizzes = await Quiz.find({ user_id: userId });
    console.log("Quizzes fetched from MongoDB: ", quizzes);

    if (!quizzes.length) {
      return res.status(404).json({ message: "No quiz data found for user" });
    }

    // Calculate statistics
    const totalCorrect = quizzes.reduce(
      (sum, quiz) => sum + quiz.correct_attempts,
      0
    );
    const totalWrong = quizzes.reduce(
      (sum, quiz) => sum + quiz.wrong_attempts,
      0
    );
    //const totalQuestions = totalCorrect + totalWrong;

    const pieChartData = {
      labels: ["Correct", "Wrong"],
      datasets: [
        {
          data: [totalCorrect, totalWrong],
          backgroundColor: ["green", "red"],
        },
      ],
    };

    const performanceByTopic = quizzes.reduce((acc, quiz) => {
      if (!acc[quiz.topic])
        acc[quiz.topic] = {
          correct: 0,
          wrong: 0,
        };
      acc[quiz.topic].correct += quiz.correct_attempts;
      acc[quiz.topic].wrong += quiz.wrong_attempts;
      return acc;
    }, {});

    const barChartData = {
      labels: Object.keys(performanceByTopic),
      datasets: [
        {
          label: "Correct",
          data: Object.values(performanceByTopic).map((topic) => topic.correct),
          backgroundColor: "green",
        },
        {
          label: "Wrong",
          data: Object.values(performanceByTopic).map((topic) => topic.wrong),
          backgroundColor: "red",
        },
      ],
    };

    const difficultyCounts = quizzes.reduce((acc, quiz) => {
      acc[quiz.difficulty] = (acc[quiz.difficulty] || 0) + 1;
      return acc;
    }, {});

    const difficultyBarChartData = {
      labels: Object.keys(difficultyCounts),
      datasets: [
        {
          label: "Questions",
          data: Object.values(difficultyCounts),
          backgroundColor: "skyblue",
        },
      ],
    };

    const activityOverTime = quizzes.reduce((acc, quiz) => {
      const date = quiz.created_at.toISOString().split("T")[0];
      if (!acc[date]) acc[date] = { correct: 0, wrong: 0 };
      acc[date].correct += quiz.correct_attempts;
      acc[date].wrong += quiz.wrong_attempts;
      return acc;
    }, {});

    const lineChartData = {
      labels: Object.keys(activityOverTime),
      datasets: [
        {
          label: "Correct",
          data: Object.values(activityOverTime).map((day) => day.correct),
          borderColor: "green",
          fill: false,
        },
        {
          label: "Wrong",
          data: Object.values(activityOverTime).map((day) => day.wrong),
          borderColor: "red",
          fill: false,
        },
      ],
    };

    res.json({
      pieChartData,
      barChartData,
      difficultyBarChartData,
      lineChartData,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};
