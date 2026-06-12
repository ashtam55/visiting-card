document.addEventListener('DOMContentLoaded', () => {

    // --- 1. 3D Tilt Effect ---
    const wrapper = document.getElementById('cardWrapper');
    const container = document.querySelector('.container');

    // Only apply hover tilt effect on non-touch devices
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        container.addEventListener('mousemove', (e) => {
            const rect = wrapper.getBoundingClientRect();
            // Calculate mouse position relative to the center of the card
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            // Calculate rotation. Adjust the multiplier for stronger/weaker effect
            const rotateX = (y / (rect.height / 2)) * -10;
            const rotateY = (x / (rect.width / 2)) * 10;

            wrapper.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        container.addEventListener('mouseleave', () => {
            // Reset to flat when mouse leaves
            wrapper.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
            wrapper.style.transition = 'transform 0.5s ease'; // Smooth reset
            setTimeout(() => {
                wrapper.style.transition = 'transform 0.1s'; // Remove smooth transition for next hover
            }, 500);
        });
    }

    // --- 2. vCard Generation and Download ---
    const downloadBtn = document.getElementById('downloadVcard');

    // Update these details to personalize the vCard
    const contactInfo = {
        firstName: "Ashtam",
        lastName: "Singh",
        title: "Tech Entrepreneur & Consultant",
        email: "hiashtam@gmail.com", // Update if needed
        phone: "+60 122903271",
        linkedin: "https://linkedin.com/in/ashtam-singh",
    };

    downloadBtn.addEventListener('click', () => {
        // Construct standard vCard 3.0 format
        const vcard = `BEGIN:VCARD
VERSION:3.0
N:${contactInfo.lastName};${contactInfo.firstName};;;
FN:${contactInfo.firstName} ${contactInfo.lastName}
TITLE:${contactInfo.title}
EMAIL;TYPE=WORK,INTERNET:${contactInfo.email}
TEL;TYPE=CELL:${contactInfo.phone}
URL:${contactInfo.website}
URL;type=LinkedIn:${contactInfo.linkedin}
URL;type=GitHub:${contactInfo.github}
END:VCARD`;

        // Create a Blob containing the vCard text
        const blob = new Blob([vcard], { type: 'text/vcard' });
        const url = window.URL.createObjectURL(blob);

        // Create a temporary link element to trigger the download
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `${contactInfo.firstName}_${contactInfo.lastName}_Contact.vcf`;

        document.body.appendChild(a);
        a.click();

        // Cleanup
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        showToast('Contact downloaded!');
    });

    // --- 3. Share Functionality ---
    const shareBtn = document.getElementById('shareBtn');

    shareBtn.addEventListener('click', async () => {
        const shareData = {
            title: `${contactInfo.firstName} ${contactInfo.lastName} - ${contactInfo.title}`,
            text: 'Check out my digital portfolio and visiting card!',
            url: window.location.href
        };

        try {
            // Check if the Web Share API is supported
            if (navigator.share) {
                await navigator.share(shareData);
                showToast('Shared successfully!');
            } else {
                // Fallback: Copy URL to clipboard
                await navigator.clipboard.writeText(window.location.href);
                showToast('Link copied to clipboard!');
            }
        } catch (err) {
            console.error('Error sharing:', err);
        }
    });

    // --- 4. Toast Notification Helper ---
    const toast = document.getElementById('toast');
    let toastTimeout;

    function showToast(message) {
        toast.textContent = message;
        toast.classList.add('show');

        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
});
