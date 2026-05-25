let defaultStudents = [
    { id: 1, name: 'Đậu Thiên An', images: [] },
    { id: 2, name: 'Nguyễn Đình Bảo', images: [] },
    { id: 3, name: 'Nguyễn Sỹ Bảo', images: [] },
    { id: 4, name: 'Nguyễn Văn Gia Bảo', images: [] },
    { id: 5, name: 'Nguyễn Hữu Xuân Bắc', images: [] },
    { id: 6, name: 'Phạm Hải Châu', images: [] },
    { id: 7, name: 'Lê Quốc Chung', images: [] },
    { id: 8, name: 'Nguyễn Thị Quỳnh Diệp', images: [] },
    { id: 9, name: 'Nguyễn Thị Hạnh Dung', images: [] },
    { id: 10, name: 'Võ Mạnh Dũng', images: [] },
    { id: 11, name: 'Nguyễn Trần An Đông', images: [] },
    { id: 12, name: 'Cấn Văn Hiếu', images: [] },
    { id: 13, name: 'Trần Nguyên Hiếu', images: [] },
    { id: 14, name: 'Lê Văn Hợp', images: [] },
    { id: 15, name: 'Nguyễn Xuân Khánh Huy', images: [] },
    { id: 16, name: 'Doãn Thị Khánh Huyền', images: [] },
    { id: 17, name: 'Nguyễn Bá Huỳnh', images: [] },
    { id: 18, name: 'Nguyễn Ngọc Vân Khánh', images: [] },
    { id: 19, name: 'Trần Hải Khánh', images: [] },
    { id: 20, name: 'Lê Xuân Kiên', images: [] },
    { id: 21, name: 'Nguyễn Trần Trung Kiên', images: [] },
    { id: 22, name: 'Vương Đình Kiên', images: [] },
    { id: 23, name: 'Nguyễn Khánh Linh', images: [] },
    { id: 24, name: 'Nguyễn Kiều Linh', images: [] },
    { id: 25, name: 'Phan Thị Ái Linh', images: [] },
    { id: 26, name: 'Nguyễn Thị Xuân Mai', images: [] },
    { id: 27, name: 'Nguyễn Hoàng Mạnh', images: [] },
    { id: 28, name: 'Trịnh Anh Minh', images: [] },
    { id: 29, name: 'Nguyễn Thảo My', images: [] },
    { id: 30, name: 'Phạm Thị Trà My', images: [] },
    { id: 31, name: 'Hoàng Lê Na', images: [] },
    { id: 32, name: 'Uông Việt Nhân', images: [] },
    { id: 33, name: 'Nguyễn Phi Bảo Nhi', images: [] },
    { id: 34, name: 'Nguyễn Thảo Nhi', images: [] },
    { id: 35, name: 'Phạm Thị Thục Nhi', images: [] },
    { id: 36, name: 'Vương Thị Yến Nhi', images: [] },
    { id: 37, name: 'Nguyễn Thị Tâm', images: [] },
    { id: 38, name: 'Nguyễn Văn Thành', images: [] },
    { id: 39, name: 'Nguyễn Minh Thắng', images: [] },
    { id: 40, name: 'Lê Thùy Trang', images: [] },
    { id: 41, name: 'Vương Huyền Trang', images: [] },
    { id: 42, name: 'Lê Văn Trung', images: [] },
    { id: 43, name: 'Nguyễn Bá Tuấn', images: [] },
    { id: 44, name: 'Trần Thanh Tuyền', images: [] },
    { id: 45, name: 'Nguyễn Thị Hà Vy', images: [] },
    { id: 46, name: 'Nguyễn Minh Hoàn', images: [] }
];

let students = [];
let qrCodeInstance = null;
let currentZoom = 100;
let currentImageIndex = 0;
let currentStudentImages = [];
let currentStudentName = '';
let currentStudentId = null;
let currentRotation = 0;
let database = null;

const firebaseConfig = {
    apiKey: "AIzaSyALx26A4ZY98eCExVNvZsUQS8WsAPiM0kU",
    authDomain: "bantukiemdiem-df3ba.firebaseapp.com",
    projectId: "bantukiemdiem-df3ba",
    storageBucket: "bantukiemdiem-df3ba.firebasestorage.app",
    messagingSenderId: "392820312997",
    appId: "1:392820312997:web:4507c78aa45a1a997df64c",
    measurementId: "G-4EG4VXDT73",
    databaseURL: "https://bantukiemdiem-df3ba-default-rtdb.asia-southeast1.firebasedatabase.app"
};

firebase.initializeApp(firebaseConfig);
database = firebase.database();

document.addEventListener('DOMContentLoaded', function() {
    initializeStudents();
    checkViewMode();
    setupEventListeners();
    loadCloudinaryConfig();
});

async function initializeStudents() {
    try {
        const snapshot = await database.ref('students').once('value');
        if (!snapshot.exists()) {
            console.log('No students in Realtime Database, initializing with default list...');
            const updates = {};
            defaultStudents.forEach(student => {
                updates[student.id] = {
                    id: student.id,
                    name: student.name,
                    images: []
                };
            });
            await database.ref('students').update(updates);
            await loadStudentsFromDatabase();
        } else {
            await loadStudentsFromDatabase();
        }
    } catch (error) {
        console.error('Error initializing students:', error);
        alert('Lỗi kết nối đến Firebase! Vui lòng kiểm tra lại cài đặt.');
    }
}

async function loadStudentsFromDatabase() {
    try {
        const snapshot = await database.ref('students').orderByChild('name').once('value');
        students = [];
        snapshot.forEach(childSnapshot => {
            students.push(childSnapshot.val());
        });
        renderStudentList();
        renderParentStudentList();
    } catch (error) {
        console.error('Error loading students:', error);
    }
}

async function saveStudentToDatabase(student) {
    try {
        await database.ref('students/' + student.id).set(student);
    } catch (error) {
        console.error('Error saving student:', error);
        alert('Lỗi lưu dữ liệu!');
    }
}

async function deleteStudentFromDatabase(id) {
    try {
        await database.ref('students/' + id).remove();
    } catch (error) {
        console.error('Error deleting student:', error);
        alert('Lỗi xóa học sinh!');
    }
}

function getCloudinaryConfig() {
    return {
        cloudName: localStorage.getItem('cloudinaryCloudName'),
        uploadPreset: localStorage.getItem('cloudinaryUploadPreset')
    };
}

function saveCloudinaryConfig(cloudName, uploadPreset) {
    localStorage.setItem('cloudinaryCloudName', cloudName);
    localStorage.setItem('cloudinaryUploadPreset', uploadPreset);
}

function loadCloudinaryConfig() {
    const config = getCloudinaryConfig();
    if (config.cloudName) {
        document.getElementById('cloudinaryCloudName').value = config.cloudName;
    }
    if (config.uploadPreset) {
        document.getElementById('cloudinaryUploadPreset').value = config.uploadPreset;
    }
}

async function uploadToCloudinary(file) {
    const config = getCloudinaryConfig();
    if (!config.cloudName || !config.uploadPreset) {
        alert('Vui lòng nhập và lưu Cloudinary Cloud Name và Upload Preset trước!');
        return null;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', config.uploadPreset);

    try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`, {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        if (result.secure_url) {
            return result.secure_url;
        } else {
            alert('Lỗi upload ảnh lên Cloudinary: ' + (result.error?.message || 'Unknown error'));
            return null;
        }
    } catch (error) {
        alert('Lỗi kết nối đến Cloudinary: ' + error.message);
        return null;
    }
}

function checkViewMode() {
    const urlParams = new URLSearchParams(window.location.search);
    const viewMode = urlParams.get('view');
    
    if (viewMode === 'parent') {
        showParentView();
    } else {
        showTeacherView();
    }
}

function showTeacherView() {
    document.getElementById('teacherView').classList.remove('hidden');
    document.getElementById('parentView').classList.add('hidden');
    generateQRCode();
}

function showParentView() {
    document.getElementById('teacherView').classList.add('hidden');
    document.getElementById('parentView').classList.remove('hidden');
}

function setupEventListeners() {
    document.getElementById('addStudentForm').addEventListener('submit', addStudent);
    document.getElementById('generateQRBtn').addEventListener('click', generateQRCode);
    document.getElementById('backToTeacherBtn').addEventListener('click', function() {
        window.location.search = '';
    });
    document.getElementById('saveCloudinaryBtn').addEventListener('click', function() {
        const cloudName = document.getElementById('cloudinaryCloudName').value.trim();
        const uploadPreset = document.getElementById('cloudinaryUploadPreset').value.trim();
        if (cloudName && uploadPreset) {
            saveCloudinaryConfig(cloudName, uploadPreset);
            alert('Đã lưu cấu hình Cloudinary!');
        }
    });
    
    const modal = document.getElementById('imageModal');
    const closeBtn = document.querySelector('.close');
    closeBtn.onclick = function() {
        modal.style.display = 'none';
    };
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
    
    document.getElementById('zoomInBtn').addEventListener('click', zoomIn);
    document.getElementById('zoomOutBtn').addEventListener('click', zoomOut);
    document.getElementById('resetZoomBtn').addEventListener('click', resetZoom);
    document.getElementById('prevImageBtn').addEventListener('click', prevImage);
    document.getElementById('nextImageBtn').addEventListener('click', nextImage);
    document.getElementById('rotateLeftBtn').addEventListener('click', rotateLeft);
    document.getElementById('rotateRightBtn').addEventListener('click', rotateRight);
    document.getElementById('saveRotationBtn').addEventListener('click', saveRotatedImage);
}

async function addStudent(e) {
    e.preventDefault();
    
    const nameInput = document.getElementById('studentName');
    const imageInput = document.getElementById('studentImage');
    
    if (imageInput.files && imageInput.files[0]) {
        const imgUrl = await uploadToCloudinary(imageInput.files[0]);
        if (imgUrl) {
            const student = {
                id: Date.now(),
                name: nameInput.value,
                images: [imgUrl]
            };
            
            await saveStudentToDatabase(student);
            await loadStudentsFromDatabase();
            
            nameInput.value = '';
            imageInput.value = '';
            
            alert('✅ Đã thêm học sinh thành công!\nPhụ huynh có thể quét mã QR để xem ảnh ngay!');
        }
    }
}

async function addImageToStudent(id, input) {
    if (!input.files || input.files.length === 0) {
        return;
    }
    
    const student = students.find(s => s.id == id);
    if (!student) {
        alert('Không tìm thấy học sinh!');
        return;
    }
    
    if (!student.images) {
        student.images = [];
    }
    
    let filesProcessed = 0;
    const totalFiles = input.files.length;
    
    for (let i = 0; i < totalFiles; i++) {
        const imgUrl = await uploadToCloudinary(input.files[i]);
        if (imgUrl) {
            student.images.push(imgUrl);
            filesProcessed++;
            if (filesProcessed >= totalFiles) {
                await saveStudentToDatabase(student);
                await loadStudentsFromDatabase();
                alert('✅ Đã thêm ảnh thành công!\nPhụ huynh có thể quét mã QR để xem ảnh ngay!');
            }
        }
    }
}

function renderStudentList() {
    const container = document.getElementById('studentList');
    if (!container) return;
    
    container.innerHTML = '';
    
    students.forEach(student => {
        const card = document.createElement('div');
        card.className = 'student-card';
        const imageCount = student.images ? student.images.length : 0;
        card.innerHTML = `
            <h4>${student.name}</h4>
            <span style="color: ${imageCount > 0 ? '#28a745' : '#dc3545'}; font-size: 0.9em;">
                ${imageCount} ảnh
            </span>
            <div class="card-actions">
                <button class="view-btn" onclick="document.getElementById('imageInput_${student.id}').click()" style="background: #17a2b8;">Thêm Ảnh</button>
                <input type="file" id="imageInput_${student.id}" accept="image/*" style="display: none;" onchange="addImageToStudent(${student.id}, this)" multiple>
                ${imageCount > 0 ? `<button class="view-btn" onclick="openImageModal('${student.id}')">Xem</button>` : ''}
                <button class="delete-btn" onclick="deleteStudent(${student.id})">Xóa</button>
            </div>
        `;
        container.appendChild(card);
    });
}

async function deleteStudent(id) {
    if (confirm('Bạn có chắc muốn xóa học sinh này?')) {
        await deleteStudentFromDatabase(id);
        await loadStudentsFromDatabase();
    }
}

function renderParentStudentList() {
    const container = document.getElementById('parentStudentList');
    if (!container) return;
    
    container.innerHTML = '';
    
    students.forEach(student => {
        const imageCount = student.images ? student.images.length : 0;
        if (imageCount > 0) {
            const card = document.createElement('div');
            card.className = 'student-card';
            card.innerHTML = `
                <h4>${student.name}</h4>
                <span style="color: #28a745; font-size: 0.9em;">
                    ${imageCount} ảnh
                </span>
            `;
            card.onclick = function() {
                openImageModal(student.id);
            };
            container.appendChild(card);
        }
    });
}

function openImageModal(studentId) {
    const student = students.find(s => s.id == studentId);
    if (!student || !student.images || student.images.length === 0) {
        alert('Chưa có ảnh cho học sinh này!');
        return;
    }
    
    currentStudentImages = student.images;
    currentStudentName = student.name;
    currentStudentId = studentId;
    currentImageIndex = 0;
    currentRotation = 0;
    
    const modal = document.getElementById('imageModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalImage = document.getElementById('modalImage');
    const imageCounter = document.getElementById('imageCounter');
    
    modalTitle.textContent = currentStudentName;
    modalImage.src = currentStudentImages[0];
    modalImage.style.transform = 'rotate(0deg)';
    imageCounter.textContent = `1 / ${currentStudentImages.length}`;
    modal.style.display = 'block';
    resetZoom();
    updateNavButtons();
}

function prevImage() {
    if (currentImageIndex > 0) {
        currentImageIndex--;
        updateModalImage();
    }
}

function nextImage() {
    if (currentImageIndex < currentStudentImages.length - 1) {
        currentImageIndex++;
        updateModalImage();
    }
}

function updateModalImage() {
    const modalImage = document.getElementById('modalImage');
    const imageCounter = document.getElementById('imageCounter');
    
    modalImage.src = currentStudentImages[currentImageIndex];
    modalImage.style.transform = 'rotate(0deg)';
    currentRotation = 0;
    imageCounter.textContent = `${currentImageIndex + 1} / ${currentStudentImages.length}`;
    resetZoom();
    updateNavButtons();
}

function rotateLeft() {
    currentRotation -= 90;
    updateImageRotation();
}

function rotateRight() {
    currentRotation += 90;
    updateImageRotation();
}

function updateImageRotation() {
    const modalImage = document.getElementById('modalImage');
    modalImage.style.transform = `rotate(${currentRotation}deg)`;
}

async function saveRotatedImage() {
    if (currentRotation === 0) {
        alert('Ảnh chưa được xoay!');
        return;
    }
    
    const modalImage = document.getElementById('modalImage');
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = async function() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const rad = (currentRotation % 360) * Math.PI / 180;
        
        if (Math.abs(currentRotation % 180) === 90) {
            canvas.width = img.height;
            canvas.height = img.width;
        } else {
            canvas.width = img.width;
            canvas.height = img.height;
        }
        
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(rad);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);
        
        const dataURL = canvas.toDataURL('image/jpeg', 0.95);
        
        const blob = await (await fetch(dataURL)).blob();
        const file = new File([blob], "rotated.jpg", { type: "image/jpeg" });
        
        const newImgUrl = await uploadToCloudinary(file);
        if (newImgUrl) {
            const student = students.find(s => s.id == currentStudentId);
            if (student) {
                student.images[currentImageIndex] = newImgUrl;
                await saveStudentToDatabase(student);
                await loadStudentsFromDatabase();
                currentStudentImages = student.images;
                currentRotation = 0;
                modalImage.src = newImgUrl;
                modalImage.style.transform = 'rotate(0deg)';
                alert('Đã lưu ảnh xoay!');
            }
        }
    };
    img.src = currentStudentImages[currentImageIndex];
}

function updateNavButtons() {
    document.getElementById('prevImageBtn').disabled = currentImageIndex === 0;
    document.getElementById('nextImageBtn').disabled = currentImageIndex === currentStudentImages.length - 1;
}

function zoomIn() {
    currentZoom += 25;
    updateZoom();
}

function zoomOut() {
    if (currentZoom > 25) {
        currentZoom -= 25;
        updateZoom();
    }
}

function resetZoom() {
    currentZoom = 100;
    updateZoom();
}

function updateZoom() {
    const modalImage = document.getElementById('modalImage');
    const zoomLevel = document.getElementById('zoomLevel');
    modalImage.style.transform = `scale(${currentZoom / 100})`;
    zoomLevel.textContent = currentZoom + '%';
}

function generateQRCode() {
    const qrContainer = document.getElementById('qrcode');
    if (!qrContainer) return;
    
    qrContainer.innerHTML = '';
    
    const parentUrl = window.location.origin + window.location.pathname + '?view=parent';
    
    qrCodeInstance = new QRCode(qrContainer, {
        text: parentUrl,
        width: 200,
        height: 200,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
    });
}
