document.addEventListener('DOMContentLoaded', () => {
    // Profile image and cover photo upload handling
    function handleImageUpload(inputId, imageElement, isAvatar = false) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    imageElement.src = event.target.result;
                    showNotification(`${isAvatar ? 'Profile picture' : 'Cover photo'} updated successfully!`);
                };
                reader.readAsDataURL(file);
            }
        };
        
        input.click();
    }

    // Handle avatar upload
    const avatarImg = document.querySelector('.profile-avatar img');
    const editAvatarBtn = document.querySelector('.edit-avatar');
    if (editAvatarBtn) {
        editAvatarBtn.addEventListener('click', () => handleImageUpload('avatar-upload', avatarImg, true));
    }

    // Handle cover photo upload
    const coverImg = document.querySelector('.profile-cover img');
    const editCoverBtn = document.querySelector('.edit-cover');
    if (editCoverBtn) {
        editCoverBtn.addEventListener('click', () => handleImageUpload('cover-upload', coverImg));
    }

    // Handle form submission and profile update
    const form = document.querySelector('.info-form');
    const profileName = document.querySelector('.profile-details h1');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Update profile information
        const formData = new FormData(form);
        const newName = formData.get('fullName');
        
        // Update header name
        if (profileName) {
            profileName.textContent = newName;
        }
        
        showNotification('Profile updated successfully!');
    });

    // Handle preference changes with validation
    document.querySelectorAll('.preference-card select, .preference-card input[type="checkbox"]').forEach(element => {
        element.addEventListener('change', () => {
            const preferenceName = element.closest('.preference-card').querySelector('h3').textContent;
            showNotification(`${preferenceName} preference updated!`);
        });
    });

    // Handle membership renewal with confirmation
    const renewBtn = document.querySelector('.renew-btn');
    if (renewBtn) {
        renewBtn.addEventListener('click', () => {
            if (confirm('Would you like to renew your premium membership?')) {
                showNotification('Processing membership renewal...');
                // Add renewal logic here
            }
        });
    }

    // Enhanced notification system with different types
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => notification.classList.add('show'), 100);

        // Remove after delay
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Add notification styles
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: var(--primary);
            color: white;
            padding: 1rem 2rem;
            border-radius: 8px;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            transform: translateX(100%);
            opacity: 0;
            transition: all 0.3s ease;
            z-index: 1000;
        }

        .notification.show {
            transform: translateX(0);
            opacity: 1;
        }

        .notification.success {
            background: var(--success);
        }

        .notification.error {
            background: var(--danger);
        }

        .notification i {
            font-size: 1.25rem;
        }
    `;
    document.head.appendChild(style);
});