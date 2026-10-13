// 1. DOM Element Selection
const registrationForm = document.getElementById('registrationForm');
const fullNameInput = document.getElementById('fullName');
const emailInput = document.getElementById('email');
const programSelect = document.getElementById('program');
const semesterInput = document.getElementById('semester');

// Error Elements
const fullNameError = document.getElementById('fullNameError');
const emailError = document.getElementById('emailError');
const programError = document.getElementById('programError');
const semesterError = document.getElementById('semesterError');

// Live Preview Elements
const previewName = document.getElementById('previewName');
const previewEmail = document.getElementById('previewEmail');
const previewProgram = document.getElementById('previewProgram');
const previewSemester = document.getElementById('previewSemester');

// List & Counter Elements
const registeredList = document.getElementById('registeredList');
const studentCount = document.getElementById('studentCount');
const themeToggleBtn = document.getElementById('themeToggleBtn');

let registeredStudentsCount = 0;

// 2. Live Preview Event Listener (Input Event)
function updateLivePreview() {
  previewName.textContent = fullNameInput.value.trim() || 'Student Name';
  previewEmail.textContent = emailInput.value.trim() || '—';
  previewProgram.textContent = programSelect.value || '—';
  previewSemester.textContent = semesterInput.value ? `Semester ${semesterInput.value}` : '—';
}

[fullNameInput, emailInput, programSelect, semesterInput].forEach(element => {
  element.addEventListener('input', updateLivePreview);
});

// Helper Function: Email Validation Regex
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// 3. Form Submission & Validation
registrationForm.addEventListener('submit', function (event) {
  event.preventDefault(); // Prevent page refresh

  // Clear previous errors
  fullNameError.textContent = '';
  emailError.textContent = '';
  programError.textContent = '';
  semesterError.textContent = '';

  fullNameInput.classList.remove('invalid');
  emailInput.classList.remove('invalid');
  programSelect.classList.remove('invalid');
  semesterInput.classList.remove('invalid');

  let isValid = true;

  // Validate Full Name
  if (!fullNameInput.value.trim()) {
    fullNameError.textContent = 'Full Name is required.';
    fullNameInput.classList.add('invalid');
    isValid = false;
  }

  // Validate Email
  if (!emailInput.value.trim()) {
    emailError.textContent = 'Email is required.';
    emailInput.classList.add('invalid');
    isValid = false;
  } else if (!isValidEmail(emailInput.value.trim())) {
    emailError.textContent = 'Please enter a valid email address.';
    emailInput.classList.add('invalid');
    isValid = false;
  }

  // Validate Program
  if (!programSelect.value) {
    programError.textContent = 'Please select a program.';
    programSelect.classList.add('invalid');
    isValid = false;
  }

  // Validate Semester
  const semesterValue = parseInt(semesterInput.value, 10);
  if (!semesterInput.value) {
    semesterError.textContent = 'Semester is required.';
    semesterInput.classList.add('invalid');
    isValid = false;
  } else if (isNaN(semesterValue) || semesterValue < 1 || semesterValue > 8) {
    semesterError.textContent = 'Semester must be between 1 and 8.';
    semesterInput.classList.add('invalid');
    isValid = false;
  }

  // 4. Create List Item on Successful Validation
  if (isValid) {
    const li = document.createElement('li');
    li.className = 'student-item';

    const nameHeading = document.createElement('div');
    nameHeading.className = 'student-name';
    nameHeading.textContent = fullNameInput.value.trim();

    const metaInfo = document.createElement('div');
    metaInfo.className = 'student-meta';
    metaInfo.textContent = `${emailInput.value.trim()} • ${programSelect.value} • Semester ${semesterInput.value}`;

    li.appendChild(nameHeading);
    li.appendChild(metaInfo);

    registeredList.appendChild(li);

    // Update Student Count
    registeredStudentsCount++;
    studentCount.textContent = registeredStudentsCount;

    // Reset Form and Preview
    registrationForm.reset();
    updateLivePreview();
  }
});

// 5. Dark / Light Mode Toggle
themeToggleBtn.addEventListener('click', function () {
  document.body.classList.toggle('light-mode');

  if (document.body.classList.contains('light-mode')) {
    themeToggleBtn.textContent = 'Dark Mode';
  } else {
    themeToggleBtn.textContent = 'Light Mode';
  }
});