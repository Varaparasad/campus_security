function showCasualLeaveForm(){
    location.href="http://127.0.0.1:3000/casual_leave.html"
}
function showMedicalLeaveForm(){
    location.href="http://127.0.0.1:3000/medical_leave.html"
}
function showLongLeaveForm(){
    location.href="http://127.0.0.1:3000/long_leave.html"
}
document.getElementById('remarks-button').addEventListener('click', function() {
    const newDiv = document.createElement('div');
    newDiv.textContent = 'New Div'; // You can customize the content here
    newDiv.style.backgroundColor = 'lightblue'; // Optional styling
    newDiv.style.padding = '10px';
    newDiv.style.margin = '10px 0';
  
    // Append the new div to the body
    document.body.appendChild(newDiv);
  });