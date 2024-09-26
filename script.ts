declare const html2pdf: any;

const form = document.getElementById("ResumeForm") as HTMLFormElement;
const resumeOutput = document.getElementById("resumeOutput") as HTMLElement;
const resumeProfilepicture = document.getElementById("resumeProfilepicture") as HTMLImageElement;
const resumename = document.getElementById("resumename") as HTMLHeadingElement;
const resumeemail = document.getElementById("resumeemail") as HTMLParagraphElement;
const resumephone = document.getElementById("resumephone") as HTMLParagraphElement;
const resumeaddress = document.getElementById("resumeaddress") as HTMLParagraphElement;
const resumeeducation = document.getElementById("resumeeducation") as HTMLParagraphElement;
const resumeWorkexperience = document.getElementById("resumeWorkexperience") as HTMLParagraphElement;
const resumecertification = document.getElementById("resumecertification") as HTMLParagraphElement;
const resumeskills = document.getElementById("resumeskills") as HTMLParagraphElement;
const editbutton = document.getElementById("editbutton") as HTMLButtonElement;
const shareLinkbutton = document.getElementById("shareLinkbutton") as HTMLButtonElement;
const downloadpdf = document.getElementById("downloadpdf") as HTMLButtonElement;

form.addEventListener("submit", async (event: Event) => {
    event.preventDefault();

    // Collect data
    const name1 = (document.getElementById("name") as HTMLInputElement).value;
    const email = (document.getElementById("email") as HTMLInputElement).value;
    const phone = (document.getElementById("phone") as HTMLInputElement).value;
    const address = (document.getElementById("address") as HTMLInputElement).value;
    const education = (document.getElementById("education") as HTMLTextAreaElement).value;
    const work_experience = (document.getElementById("work_experience") as HTMLTextAreaElement).value;
    const certification = (document.getElementById("certification") as HTMLTextAreaElement).value;
    const skills = (document.getElementById("skills") as HTMLTextAreaElement).value;
    const profilepicture = document.getElementById("profilepicture") as HTMLInputElement;

    const picturefile = profilepicture.files ? profilepicture.files[0] : null;

    let photoBase64 = '';

    if (picturefile) {
        photoBase64 = await fileToBase64(picturefile);
        localStorage.setItem("Profilepicture", photoBase64);
        resumeProfilepicture.src = photoBase64;
    }

    // Set resume details
    resumename.textContent = name1;
    resumeemail.textContent = `Email: ${email}`;
    resumephone.textContent = `Phone: ${phone}`;
    resumeaddress.textContent = `Address: ${address}`;
    resumeeducation.textContent = education;
    resumeWorkexperience.textContent = work_experience;
    resumecertification.textContent = certification;
    resumeskills.textContent = skills;

    // Show resume output
    document.querySelector(".container")?.classList.add("hidden");
    resumeOutput.classList.remove("hidden");

    // Create unique URL
    const querParams = new URLSearchParams({
        name: name1,
        email: email,
        phone: phone,
        address: address,
        education: education,
        work_experience: work_experience,
        skills: skills,
    });

    const uniqueUrl = `${window.location.origin}?${querParams.toString()}`;
    shareLinkbutton.addEventListener("click", () => {
        navigator.clipboard.writeText(uniqueUrl);
        alert('The Link is Copied!');
    });

    window.history.replaceState(null, '', `${querParams.toString()}`);
});

// Function to convert file to base64
function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Add edit button function
editbutton.addEventListener("click", () => {
    updateform();

    document.querySelector(".container")?.classList.remove("hidden");
    resumeOutput.classList.add("hidden");
});

function updateform() {
    (document.getElementById("name") as HTMLInputElement).value = resumename.textContent || '';
    (document.getElementById("email") as HTMLInputElement).value = resumeemail.textContent?.replace('Email: ', '') || '';
    (document.getElementById("phone") as HTMLInputElement).value = resumephone.textContent?.replace('Phone: ', '') || '';
    (document.getElementById("address") as HTMLInputElement).value = resumeaddress.textContent?.replace('Address: ', '') || '';
    (document.getElementById("education") as HTMLTextAreaElement).value = resumeeducation.textContent || '';
    (document.getElementById("work_experience") as HTMLTextAreaElement).value = resumeWorkexperience.textContent || '';
    (document.getElementById("certification") as HTMLTextAreaElement).value = resumecertification.textContent || '';
    (document.getElementById("skills") as HTMLTextAreaElement).value = resumeskills.textContent || '';
}

// Handle PDF download
downloadpdf.addEventListener('click', () => {
    if (typeof html2pdf === 'undefined') {
        alert('Error: html2pdf library is not loaded.');
        return;
    }

    // Hide buttons before generating the PDF
    editbutton.style.display = 'none';
    shareLinkbutton.style.display = 'none';
    downloadpdf.style.display = 'none';

    // Optionally, add a class for PDF styling
    resumeOutput.classList.add('pdf-style');

    const resumeOptions = {
        margin: 0.5,
        filename: 'resume.pdf',
        image: { type: 'jpeg', quality: 1.0 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    // Generate and download PDF
    html2pdf()
        .from(resumeOutput)
        .set(resumeOptions)
        .save()
        .then(() => {
            // Show buttons again after PDF download
            editbutton.style.display = 'inline-block';
            shareLinkbutton.style.display = 'inline-block';
            downloadpdf.style.display = 'inline-block';

            // Remove PDF styling class
            resumeOutput.classList.remove('pdf-style');
        })
        .catch((error: Error) => {
            console.error('PDF generation error:', error);
            // Show buttons again in case of error
            editbutton.style.display = 'inline-block';
            shareLinkbutton.style.display = 'inline-block';
            downloadpdf.style.display = 'inline-block';

            // Remove PDF styling class
            resumeOutput.classList.remove('pdf-style');

        });


});

// Load data from URL
window.addEventListener("DOMContentLoaded", () => {
    const querParams = new URLSearchParams(window.location.search);
    const name = querParams.get("name") || '';
    const email = querParams.get("email") || '';
    const phone = querParams.get("phone") || '';
    const address = querParams.get("address") || '';
    const education = querParams.get("education") || '';
    const work_experience = querParams.get("work_experience") || '';
    const certification = querParams.get("certification") || '';
    const skills = querParams.get("skills") || '';

    if (name || email || phone || address || education || work_experience || certification || skills) {
        resumename.textContent = name;
        resumeemail.textContent = `Email: ${email}`;
        resumephone.textContent = `Phone: ${phone}`;
        resumeaddress.textContent = `Address: ${address}`;
        resumeeducation.textContent = education;
        resumeWorkexperience.textContent = work_experience;
        resumecertification.textContent = certification;
        resumeskills.textContent = skills;

        const saveimage = localStorage.getItem("Profilepicture");
        if (saveimage) {
            resumeProfilepicture.src = saveimage;
        }

        // Hide the form and show the resume output
        document.querySelector(".container")?.classList.add("hidden");
        resumeOutput.classList.remove("hidden");
    }
});

// Set profile picture styles
resumeProfilepicture.style.width = "170px";
resumeProfilepicture.style.height = "170px";
resumeProfilepicture.style.objectFit = "cover";
resumeProfilepicture.style.borderRadius = "50%";
resumeProfilepicture.style.display = "block";
resumeProfilepicture.style.margin = "auto";
