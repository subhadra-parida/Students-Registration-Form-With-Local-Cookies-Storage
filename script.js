// Get form and table elements
const studentForm = document.getElementById('studentForm');
const studentsList = document.getElementById('studentsList');
const storageOption = document.getElementById('storageOption');

// Event listener to handle form submission
studentForm.addEventListener('submit', function (event) {
    event.preventDefault();

    // Get form values
    const name = document.getElementById('name').value;
    const rollNo = document.getElementById('rollNo').value;
    const subject = document.getElementById('subject').value;
    const storageType = storageOption.value;

    // Check if all fields are filled
    if (!name || !rollNo || !subject) {
        window.alert('Please fill in all fields.');
        return;
    }

    // Check if the roll number is already registered
    if (isRollNoDuplicate(rollNo)) {
        window.alert(`Roll number ${rollNo} is already registered.`);
        return;
    }

    // Confirm before submission
    if (window.confirm("Are you sure you want to submit the form?")) {
        const student = { name, rollNo, subject, storageType };

        // Store the student in localStorage or cookies
        if (storageType === 'localStorage') {
            addStudentToLocalStorage(student);
        } else {
            addStudentToCookies(student);
        }

        // Reset form and update the table display
        studentForm.reset();
        displayStudents();
        window.alert("Student details submitted successfully!");
    }
});

// Function to check if roll number already exists
function isRollNoDuplicate(rollNo) {
    // Get students from localStorage and cookies
    let students = JSON.parse(localStorage.getItem('students')) || [];
    let cookieStudents = getCookies('students') ? JSON.parse(getCookies('students')) : [];

    // Combine students from both storage types
    let allStudents = students.concat(cookieStudents);

    // Check if any student already has the same roll number
    return allStudents.some(student => student.rollNo === rollNo);
}

// Add student to localStorage
function addStudentToLocalStorage(student) {
    let students = JSON.parse(localStorage.getItem('students')) || [];
    students.push(student);
    localStorage.setItem('students', JSON.stringify(students));
}

// Add student to cookies
function addStudentToCookies(student) {
    let students = getCookies('students') ? JSON.parse(getCookies('students')) : [];
    students.push(student);
    setCookie('students', JSON.stringify(students), 7); // Store cookie for 7 days
}

// Load students from localStorage or cookies and display them
document.addEventListener('DOMContentLoaded', displayStudents);

function displayStudents() {
    studentsList.innerHTML = ''; // Clear existing table rows

    let students = JSON.parse(localStorage.getItem('students')) || [];
    let cookieStudents = getCookies('students') ? JSON.parse(getCookies('students')) : [];

    // Combine students from both storage types
    let allStudents = students.concat(cookieStudents);

    // If no students are found, display a message
    if (allStudents.length === 0) {
        studentsList.innerHTML = '<tr><td colspan="7">No students registered yet.</td></tr>';
        return;
    }

    // Display each student in the table
    allStudents.forEach((student, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${student.name}</td>
            <td>${student.rollNo}</td>
            <td>${student.subject}</td>
            <td>${student.storageType}</td>
            <td><button class="edit-btn" data-index="${index}" data-storage="${student.storageType}">Edit</button></td>
            <td><button class="delete-btn" data-index="${index}" data-storage="${student.storageType}">Delete</button></td>
        `;
        studentsList.appendChild(row);
    });

    // Add event listeners for edit and delete buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', editStudent);
    });
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', deleteStudent);
    });
}

// Edit student data
function editStudent(event) {
    const index = event.target.dataset.index;
    const storageType = event.target.dataset.storage;

    let students = storageType === 'localStorage' ? JSON.parse(localStorage.getItem('students')) : JSON.parse(getCookies('students'));

    const student = students[index];
    document.getElementById('name').value = student.name;
    document.getElementById('rollNo').value = student.rollNo;
    document.getElementById('subject').value = student.subject;
    storageOption.value = student.storageType;

    // Confirm before editing
    if (window.confirm("Are you sure you want to edit this student's information?")) {
        // Remove the student being edited
        students.splice(index, 1);
        if (storageType === 'localStorage') {
            localStorage.setItem('students', JSON.stringify(students));
        } else {
            setCookie('students', JSON.stringify(students), 7);
        }

        displayStudents();
        window.alert("Student details updated successfully!");
    }
}

// Delete student data
function deleteStudent(event) {
    const index = event.target.dataset.index;
    const storageType = event.target.dataset.storage;

    if (window.confirm("Are you sure you want to delete this student's details?")) {
        let students = storageType === 'localStorage' ? JSON.parse(localStorage.getItem('students')) : JSON.parse(getCookies('students'));

        // Remove the selected student from storage
        students.splice(index, 1);
        if (storageType === 'localStorage') {
            localStorage.setItem('students', JSON.stringify(students));
        } else {
            setCookie('students', JSON.stringify(students), 7);
        }

        displayStudents();
        window.alert("Student details deleted successfully!");
    }
}

// Helper functions for cookies
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = `${name}=${value};${expires};path=/`;
}

function getCookies(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}
