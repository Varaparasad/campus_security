// Function to show the main dashboard
function showDashboard() {
    document.getElementById("dashboard-content").style.display = "block";
    document.getElementById("apply-leave-content").style.display = "none";
}

// Function to show the apply leave form
function showApplyLeave() {
    document.getElementById("dashboard-content").style.display = "none";
    document.getElementById("apply-leave-content").style.display = "block";
}

function showCasualLeaveForm() {
    document.getElementById("casual-leave-form").style.display = "block";
    // Hide other forms
    document.getElementById("medical-leave-form").style.display = "none";
    document.getElementById("long-leave-form").style.display = "none";
}

function showMedicalLeaveForm() {
    document.getElementById("medical-leave-form").style.display = "block";
    // Hide other forms
    document.getElementById("casual-leave-form").style.display = "none";
    document.getElementById("long-leave-form").style.display = "none";
}

function showLongLeaveForm() {
    document.getElementById("long-leave-form").style.display = "block";
    // Hide other forms
    document.getElementById("casual-leave-form").style.display = "none";
    document.getElementById("medical_leave-form").style.display = "none";
}