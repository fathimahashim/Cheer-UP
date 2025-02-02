document.addEventListener("DOMContentLoaded", function () {
    const moodButtons = document.querySelectorAll(".mood-btn");
    const moodHistory = document.getElementById("mood-history");
    const affirmation = document.getElementById("affirmation");
    const moodInsight = document.getElementById("mood-insight");
    const moodPrediction = document.getElementById("mood-prediction");

    const moodAffirmations = {
        happy: "You're doing great! Keep smiling, and you'll spread positivity everywhere.",
        sad: "It's okay to feel down sometimes. Take a deep breath and be kind to yourself.",
        stressed: "Take a moment to breathe. You've got this, and you're stronger than you think.",
        relaxed: "You deserve this peace. Enjoy the calmness and cherish the moment."
    };

    const moodInsights = {
        happy: "You're in a good place mentally. Keep up the positive energy!",
        sad: "It's a tough time, but things will improve. Don't rush yourself.",
        stressed: "You may be juggling a lot, but remember to take breaks.",
        relaxed: "You're in a serene state, perfect for focus or reflection."
    };

    // Use Chrome storage API (localStorage or chrome.storage)
    chrome.storage.local.get('moodHistory', function(data) {
        const moodHistoryData = data.moodHistory || [];
        moodHistoryData.forEach(mood => {
            const listItem = document.createElement("li");
            listItem.textContent = `${new Date().toLocaleString()}: ${mood}`;
            moodHistory.appendChild(listItem);
        });

        updateMoodPrediction(moodHistoryData);
    });

    moodButtons.forEach(button => {
        button.addEventListener("click", function () {
            const mood = this.getAttribute("data-mood");

            // Add mood to history and update UI
            const listItem = document.createElement("li");
            listItem.textContent = `${new Date().toLocaleString()}: ${mood}`;
            moodHistory.appendChild(listItem);

            // Save mood to Chrome storage
            chrome.storage.local.get('moodHistory', function(data) {
                const moodHistoryData = data.moodHistory || [];
                moodHistoryData.push(mood);
                chrome.storage.local.set({ moodHistory: moodHistoryData });
            });

            // Display affirmation and insight
            affirmation.textContent = moodAffirmations[mood];
            moodInsight.textContent = moodInsights[mood];

            // Update mood prediction
            updateMoodPrediction();
        });
    });

    // Function to predict mood based on history
    function updateMoodPrediction(moodHistoryData) {
        const moodCount = {
            happy: 0,
            sad: 0,
            stressed: 0,
            relaxed: 0
        };

        moodHistoryData.forEach(mood => {
            moodCount[mood]++;
        });

        const predictedMood = Object.keys(moodCount).reduce((a, b) => moodCount[a] > moodCount[b] ? a : b);
        moodPrediction.textContent = `Your predicted mood is: ${predictedMood.charAt(0).toUpperCase() + predictedMood.slice(1)}`;
    }
});
