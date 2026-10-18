document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('profile-form');
    const reviewPanel = document.getElementById('academic-review');
    const reviewContainer = document.getElementById('review');
    const editBtn = document.getElementById('edit');
    const confirmBtn = document.getElementById('confirm');

    function collectFormData() {
        return [
            { label: "Student ID", value: form.student_id.value },
            { label: "Full Name", value: form.fullname.value },
            { label: "USEK Email", value: form.email.value },
            { label: "Mobile Number", value: form.phone.value },
            { label: "Date of Birth", value: form.birthdate.value },
            { label: "GitHub", value: form.portfolio.value || "Not provided" },
            { label: "GIN446 Website", value: form.gin446.value || "Not provided" },
            { label: "Engineering Major", value: form.major.value },
            { label: "Current GPA", value: form.gpa.value },
            { label: "Credits Completed", value: form.credits.value },
            { label: "Expected Graduation", value: document.querySelector('input[name="graduation"]:checked').value },
            { label: "Completed Internship", value: form.internship_completed.value },
            { label: "Primary Programming Language", value: form.language.value },
            { label: "Proposed Project Title", value: form.project_title.value },
            { label: "Preferred Project Area", value: form.project_area.value },
            { label: "Preferred Team Size", value: form.team_size.value },
            { label: "Preferred Meeting Date & Time", value: `${form.meeting_date.value} at ${form.meeting_time.value}` }
        ];
    }

    function fillReviewPanel(data) {
        reviewContainer.innerHTML = "";
        
        data.forEach(item => {
            const row = document.createElement('p');
            
            const strongLabel = document.createElement('strong');
            strongLabel.textContent = `${item.label}: `;
            
            const spanValue = document.createElement('span');
            spanValue.textContent = item.value;

            row.appendChild(strongLabel);
            row.appendChild(spanValue);
            reviewContainer.appendChild(row);
        });
    }

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        if (!form.reportValidity()) {
            return;
        }

        const fieldsToReview = collectFormData();
        fillReviewPanel(fieldsToReview);

        form.classList.add('hidden');
        reviewPanel.classList.add('open');;
    });

    editBtn.addEventListener('click', () => {
        reviewPanel.classList.remove('open');
        form.classList.remove('hidden');
    });

    confirmBtn.addEventListener('click', () => {
        form.submit();
    });
});