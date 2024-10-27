function validatePassword(password, confirmPassword) {
    const minLength = 8;                       
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*]/.test(password);
    if (password !== confirmPassword) {
        return "Passwords do not match.";
    }
    if (password.length < minLength) {
        return "Password must be at least 8 characters long.";
    }
    if (!hasUpperCase) {
        return "Password must contain at least one uppercase letter.";
    }
    if (!hasLowerCase) {
        return "Password must contain at least one lowercase letter.";
    }
    if (!hasNumber) {
        return "Password must contain at least one number.";
    }
    if (!hasSpecialChar) {
        return "Password must contain at least one special character (e.g., !@#$%^&*).";
    }

    return "Password is valid and matches the confirmation.";
}
function validatePasswordalert(){
    const password = document.getElementById("pass").value;
    const cpassword = document.getElementById("cpass").value;
    alert(validatePassword(password, cpassword));
}
