// Panel de Administración - Versión Mejorada
let isAdmin = false;
let adminSessionTimeout = null;
const ADMIN_SESSION_DURATION = 30 * 60 * 1000; // 30 minutos

// Inicializar panel de admin
document.addEventListener('DOMContentLoaded', function() {
    initializeAdminPanel();
    checkExistingSession();
});

function initializeAdminPanel() {
    const adminBtn = document.getElementById('adminBtn');
    const closeAdminBtn = document.getElementById('closeAdminBtn');
    const addSalonBtn = document.getElementById('addSalonBtn');
    const refreshDataBtn = document.getElementById('refreshDataBtn');
    const resetDataBtn = document.getElementById('resetDataBtn');
    
    if (adminBtn) {
        adminBtn.addEventListener('click', handleAdminAccess);
    }
    
    if (closeAdminBtn) {
        closeAdminBtn.addEventListener('click', closeAdminPanel);
    }
    
    if (addSalonBtn) {
        addSalonBtn.addEventListener('click', showAddSalonForm);
    }
    
    if (refreshDataBtn) {
        refreshDataBtn.addEventListener('click', refreshData);
    }
    
    if (resetDataBtn) {
        resetDataBtn.addEventListener('click', resetData);
    }
}

// Verificar si hay sesión activa
function checkExistingSession() {
    const session = localStorage.getItem('adminSession');
    if (session) {
        const sessionData = JSON.parse(session);
        if (sessionData.expires > Date.now()) {
            isAdmin = true;
            updateAdminUI();
            startSessionTimer();
        } else {
            localStorage.removeItem('adminSession');
        }
    }
}

// Manejar acceso de admin
function handleAdminAccess() {
    if (isAdmin) {
        openAdminPanel();
    } else {
        showAdminLoginModal();
    }
}

// Mostrar modal de login elegante
function showAdminLoginModal() {
    const modalHTML = `
        <div class="modal-overlay" id="adminLoginModal">
            <div class="modal-content" style="max-width: 400px; text-align: center;">
                <div style="padding: 30px 20px;">
                    <div style="font-size: 3rem; color: var(--primary-color); margin-bottom: 15px;">
                        <i class="fas fa-lock"></i>
                    </div>
                    <h3 style="color: var(--dark-color); margin-bottom: 10px;">Acceso Administrador</h3>
                    <p style="color: #666; margin-bottom: 25px;">Ingrese la contraseña para continuar</p>
                    
                    <div class="form-group">
                        <input type="password" 
                               id="adminPasswordInput" 
                               class="form-control" 
                               placeholder="Contraseña de administrador"
                               style="text-align: center; font-size: 1.1rem; padding: 12px;"
                               onkeypress="handleAdminPasswordKeypress(event)">
                    </div>
                    
                    <div style="display: flex; gap: 10px; margin-top: 25px;">
                        <button class="btn btn-primary" onclick="verifyAdminCredentials()" 
                                style="flex: 1; padding: 12px;">
                            <i class="fas fa-sign-in-alt"></i> Ingresar
                        </button>
                        <button class="btn btn-secondary" onclick="closeAdminLoginModal()" 
                                style="flex: 1; padding: 12px;">
                            <i class="fas fa-times"></i> Cancelar
                        </button>
                    </div>
                    
                    <div id="loginError" style="color: var(--danger-color); margin-top: 15px; display: none;">
                        <i class="fas fa-exclamation-circle"></i> Contraseña incorrecta
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Enfocar el input automáticamente
    setTimeout(() => {
        const passwordInput = document.getElementById('adminPasswordInput');
        if (passwordInput) {
            passwordInput.focus();
        }
    }, 100);
    
    // Cerrar modal al hacer clic fuera
    const modal = document.getElementById('adminLoginModal');
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeAdminLoginModal();
        }
    });
}

// Manejar tecla Enter en el input de contraseña
function handleAdminPasswordKeypress(event) {
    if (event.key === 'Enter') {
        verifyAdminCredentials();
    }
}

// Verificar credenciales (contraseña segura)
function verifyAdminCredentials() {
    const passwordInput = document.getElementById('adminPasswordInput');
    const errorDiv = document.getElementById('loginError');
    const enteredPassword = passwordInput.value;
    
    // Contraseña hasheada simple (en un caso real usarías bcrypt)
    const hashedPassword = 'DarrellRS023'; // En producción, esto debería estar en el backend
    
    if (enteredPassword === hashedPassword) {
        isAdmin = true;
        createAdminSession();
        closeAdminLoginModal();
        openAdminPanel();
        notifier.show('✅ Sesión de administrador iniciada', 'success', 3000);
    } else {
        errorDiv.style.display = 'block';
        passwordInput.style.borderColor = 'var(--danger-color)';
        passwordInput.focus();
        passwordInput.select();
        
        // Agitar el input para feedback visual
        passwordInput.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            passwordInput.style.animation = '';
        }, 500);
    }
}

// Crear sesión de administrador
function createAdminSession() {
    const sessionData = {
        expires: Date.now() + ADMIN_SESSION_DURATION,
        created: Date.now()
    };
    localStorage.setItem('adminSession', JSON.stringify(sessionData));
    startSessionTimer();
}

// Iniciar timer de sesión
function startSessionTimer() {
    if (adminSessionTimeout) {
        clearTimeout(adminSessionTimeout);
    }
    
    adminSessionTimeout = setTimeout(() => {
        logoutAdmin();
        notifier.show('🔒 Sesión expirada por seguridad', 'warning', 5000);
    }, ADMIN_SESSION_DURATION);
}

// Cerrar modal de login
function closeAdminLoginModal() {
    const modal = document.getElementById('adminLoginModal');
    if (modal) {
        modal.remove();
    }
}

// Abrir panel de administración
function openAdminPanel() {
    if (!isAdmin) {
        showAdminLoginModal();
        return;
    }
    
    document.getElementById('adminPanel').style.display = 'block';
    loadAdminSalones();
    updateAdminUI();
}

// Cerrar panel de administración
function closeAdminPanel() {
    document.getElementById('adminPanel').style.display = 'none';
    notifier.show('Panel de administración cerrado', 'info', 2000);
}

// Cerrar sesión de administrador
function logoutAdmin() {
    isAdmin = false;
    localStorage.removeItem('adminSession');
    
    if (adminSessionTimeout) {
        clearTimeout(adminSessionTimeout);
        adminSessionTimeout = null;
    }
    
    document.getElementById('adminPanel').style.display = 'none';
    updateAdminUI();
    notifier.show('🔒 Sesión de administrador cerrada', 'info', 3000);
}

// Actualizar UI según estado de admin
function updateAdminUI() {
    const adminBtn = document.getElementById('adminBtn');
    if (!adminBtn) return;
    
    if (isAdmin) {
        adminBtn.innerHTML = '<i class="fas fa-user-shield"></i> Cerrar Sesión';
        adminBtn.style.background = 'var(--success-color)';
        adminBtn.onclick = logoutAdmin;
    } else {
        adminBtn.innerHTML = '<i class="fas fa-user-cog"></i> Panel Admin';
        adminBtn.style.background = 'var(--warning-color)';
        adminBtn.onclick = handleAdminAccess;
    }
}

// 🔒 FUNCIONES EXISTENTES (MANTENER SIN CAMBIOS)

// Cargar salones para administración
function loadAdminSalones() {
    const container = document.getElementById('adminSalonesList');
    if (!container) return;
    
    const salones = appDatabase.getAllSalones();
    
    container.innerHTML = salones.map(salon => `
        <div class="admin-salon-item" style="background: #f8f9fa; padding: 15px; border-radius: 10px; border-left: 4px solid #ff6b8b; margin-bottom: 15px;">
            <h4 style="margin: 0 0 10px 0; color: #333;">${salon.name}</h4>
            <p style="margin: 0 0 10px 0; color: #666; font-size: 0.9em;">${salon.description.substring(0, 100)}...</p>
            <div class="admin-salon-actions" style="display: flex; gap: 10px;">
                <button class="btn btn-primary" onclick="editSalon(${salon.id})" style="padding: 8px 15px; background: #ff6b8b; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn btn-danger" onclick="deleteSalon(${salon.id})" style="padding: 8px 15px; background: #ff6b6b; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </div>
            ${salon.comments && salon.comments.length > 0 ? `
                <div style="margin-top: 10px;">
                    <h5 style="margin: 15px 0 10px 0; color: #333;">Comentarios (${salon.comments.length})</h5>
                    ${salon.comments.map(comment => `
                        <div style="background: white; padding: 10px; margin: 5px 0; border-radius: 5px; border: 1px solid #ddd;">
                            <strong style="color: #ff6b8b;">${comment.username}</strong> 
                            <span style="color: #ffc107;">${'★'.repeat(comment.rating)}${'☆'.repeat(5-comment.rating)}</span>
                            <p style="margin: 5px 0; color: #555;">${comment.text}</p>
                            <button class="btn btn-danger btn-sm" onclick="deleteComment(${salon.id}, '${comment.username}')" style="padding: 4px 8px; background: #ff6b6b; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 0.8em;">
                                <i class="fas fa-trash"></i> Eliminar
                            </button>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
        </div>
    `).join('');
}

// Mostrar formulario profesional para agregar salón
function showAddSalonForm() {
    if (!isAdmin) {
        notifier.show('Debe iniciar sesión como administrador', 'error', 3000);
        return;
    }

    const modalHTML = `
        <div class="modal-overlay" id="addSalonModal">
            <div class="modal-content" style="max-width: 600px; max-height: 90vh; overflow-y: auto;">
                <div style="padding: 25px; position: relative;">
                    <!-- Header del modal -->
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; padding-bottom: 15px; border-bottom: 2px solid #f0f0f0;">
                        <h3 style="margin: 0; color: var(--primary-color); display: flex; align-items: center; gap: 10px;">
                            <i class="fas fa-plus-circle"></i> Agregar Nuevo Salón
                        </h3>
                        <button onclick="closeAddSalonModal()" style="background: none; border: none; font-size: 24px; color: #999; cursor: pointer; padding: 5px; border-radius: 50%; transition: all 0.3s ease;">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>

                    <!-- Formulario -->
                    <form id="addSalonForm" onsubmit="handleAddSalonSubmit(event)">
                        <!-- Información Básica -->
                        <div class="form-section" style="margin-bottom: 30px;">
                            <h4 style="color: var(--secondary-color); margin-bottom: 15px; display: flex; align-items: center; gap: 8px;">
                                <i class="fas fa-info-circle"></i> Información Básica
                            </h4>
                            
                            <div class="form-group">
                                <label for="salonName" style="display: block; margin-bottom: 8px; font-weight: 600; color: #333;">
                                    <i class="fas fa-signature"></i> Nombre del Salón *
                                </label>
                                <input type="text" id="salonName" class="form-control" required 
                                       placeholder="Ej: Fiesta Mágica Infantil" 
                                       style="width: 100%; padding: 12px 15px; border: 2px solid #e9ecef; border-radius: 8px; font-size: 1rem; transition: all 0.3s ease;">
                                <div class="form-hint" style="font-size: 0.85rem; color: #666; margin-top: 5px;">
                                    Nombre comercial del salón de fiestas
                                </div>
                            </div>

                            <div class="form-group">
                                <label for="salonDescription" style="display: block; margin-bottom: 8px; font-weight: 600; color: #333;">
                                    <i class="fas fa-align-left"></i> Descripción *
                                </label>
                                <textarea id="salonDescription" class="form-control" required rows="4"
                                          placeholder="Describa las características, servicios y atracciones del salón..."
                                          style="width: 100%; padding: 12px 15px; border: 2px solid #e9ecef; border-radius: 8px; font-size: 1rem; resize: vertical; transition: all 0.3s ease;"></textarea>
                                <div class="form-hint" style="font-size: 0.85rem; color: #666; margin-top: 5px;">
                                    Incluya información sobre temáticas, capacidad, servicios incluidos, etc.
                                </div>
                            </div>
                        </div>

                        <!-- Imágenes -->
                        <div class="form-section" style="margin-bottom: 30px;">
                            <h4 style="color: var(--secondary-color); margin-bottom: 15px; display: flex; align-items: center; gap: 8px;">
                                <i class="fas fa-images"></i> Imágenes
                            </h4>
                            
                            <div class="form-group">
                                <label for="mainImage" style="display: block; margin-bottom: 8px; font-weight: 600; color: #333;">
                                    <i class="fas fa-image"></i> Imagen Principal *
                                </label>
                                <input type="url" id="mainImage" class="form-control" required 
                                       placeholder="https://ejemplo.com/imagen-principal.jpg"
                                       style="width: 100%; padding: 12px 15px; border: 2px solid #e9ecef; border-radius: 8px; font-size: 1rem; transition: all 0.3s ease;">
                                <div class="form-hint" style="font-size: 0.85rem; color: #666; margin-top: 5px;">
                                    URL de la imagen que se mostrará como portada
                                </div>
                            </div>

                            <div class="form-group">
                                <label for="galleryImages" style="display: block; margin-bottom: 8px; font-weight: 600; color: #333;">
                                    <i class="fas fa-photo-video"></i> Galería de Imágenes
                                </label>
                                <textarea id="galleryImages" class="form-control" rows="3"
                                          placeholder="https://ejemplo.com/imagen1.jpg, https://ejemplo.com/imagen2.jpg"
                                          style="width: 100%; padding: 12px 15px; border: 2px solid #e9ecef; border-radius: 8px; font-size: 1rem; resize: vertical; transition: all 0.3s ease;"></textarea>
                                <div class="form-hint" style="font-size: 0.85rem; color: #666; margin-top: 5px;">
                                    URLs separadas por comas. Mínimo recomendado: 3 imágenes
                                </div>
                            </div>

                            <!-- Vista previa de imágenes -->
                            <div id="imagePreview" style="margin-top: 15px; display: none;">
                                <h5 style="margin-bottom: 10px; color: #666; font-size: 0.9rem;">Vista Previa:</h5>
                                <div id="previewContainer" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(80px, 1fr)); gap: 10px;"></div>
                            </div>
                        </div>

                        <!-- Ubicación -->
                        <div class="form-section" style="margin-bottom: 30px;">
                            <h4 style="color: var(--secondary-color); margin-bottom: 15px; display: flex; align-items: center; gap: 8px;">
                                <i class="fas fa-map-marker-alt"></i> Ubicación
                            </h4>
                            
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                                <div class="form-group">
                                    <label for="salonLat" style="display: block; margin-bottom: 8px; font-weight: 600; color: #333;">
                                        <i class="fas fa-globe-americas"></i> Latitud *
                                    </label>
                                    <input type="number" id="salonLat" class="form-control" required step="any"
                                           placeholder="Ej: -34.603722"
                                           style="width: 100%; padding: 12px 15px; border: 2px solid #e9ecef; border-radius: 8px; font-size: 1rem; transition: all 0.3s ease;">
                                </div>

                                <div class="form-group">
                                    <label for="salonLng" style="display: block; margin-bottom: 8px; font-weight: 600; color: #333;">
                                        <i class="fas fa-globe-americas"></i> Longitud *
                                    </label>
                                    <input type="number" id="salonLng" class="form-control" required step="any"
                                           placeholder="Ej: -58.381592"
                                           style="width: 100%; padding: 12px 15px; border: 2px solid #e9ecef; border-radius: 8px; font-size: 1rem; transition: all 0.3s ease;">
                                </div>
                            </div>
                            
                            <div class="form-hint" style="font-size: 0.85rem; color: #666; margin-top: 10px; background: #f8f9fa; padding: 10px; border-radius: 5px;">
                                <i class="fas fa-info-circle"></i> 
                                Puede obtener las coordenadas desde 
                                <a href="https://www.google.com/maps" target="_blank" style="color: var(--primary-color);">Google Maps</a>. 
                                Haga clic derecho en el lugar y seleccione "¿Qué hay aquí?"
                            </div>
                        </div>

                        <!-- Información Adicional -->
                        <div class="form-section" style="margin-bottom: 30px;">
                            <h4 style="color: var(--secondary-color); margin-bottom: 15px; display: flex; align-items: center; gap: 8px;">
                                <i class="fas fa-star"></i> Información Adicional
                            </h4>
                            
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                                <div class="form-group">
                                    <label for="salonCapacity" style="display: block; margin-bottom: 8px; font-weight: 600; color: #333;">
                                        <i class="fas fa-users"></i> Capacidad
                                    </label>
                                    <input type="number" id="salonCapacity" class="form-control" 
                                           placeholder="Ej: 50"
                                           style="width: 100%; padding: 12px 15px; border: 2px solid #e9ecef; border-radius: 8px; font-size: 1rem; transition: all 0.3s ease;">
                                </div>

                                <div class="form-group">
                                    <label for="salonPrice" style="display: block; margin-bottom: 8px; font-weight: 600; color: #333;">
                                        <i class="fas fa-tag"></i> Precio Base
                                    </label>
                                    <input type="text" id="salonPrice" class="form-control" 
                                           placeholder="Ej: $50,000"
                                           style="width: 100%; padding: 12px 15px; border: 2px solid #e9ecef; border-radius: 8px; font-size: 1rem; transition: all 0.3s ease;">
                                </div>
                            </div>

                            <div class="form-group">
                                <label for="salonFeatures" style="display: block; margin-bottom: 8px; font-weight: 600; color: #333;">
                                    <i class="fas fa-check-circle"></i> Características
                                </label>
                                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px;">
                                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                                        <input type="checkbox" name="features" value="parque_inflable"> 
                                        <i class="fas fa-cloud" style="color: #ff6b8b;"></i> Parque Inflable
                                    </label>
                                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                                        <input type="checkbox" name="features" value="animacion"> 
                                        <i class="fas fa-magic" style="color: #845ec2;"></i> Animación
                                    </label>
                                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                                        <input type="checkbox" name="features" value="catering"> 
                                        <i class="fas fa-utensils" style="color: #ff9671;"></i> Catering
                                    </label>
                                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                                        <input type="checkbox" name="features" value="decoracion"> 
                                        <i class="fas fa-palette" style="color: #00c9a7;"></i> Decoración
                                    </label>
                                </div>
                            </div>
                        </div>

                        <!-- Botones de acción -->
                        <div style="display: flex; gap: 15px; margin-top: 30px; padding-top: 20px; border-top: 2px solid #f0f0f0;">
                            <button type="button" onclick="closeAddSalonModal()" 
                                    style="flex: 1; padding: 15px; background: #6c757d; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.3s ease;">
                                <i class="fas fa-times"></i> Cancelar
                            </button>
                            <button type="submit" 
                                    style="flex: 2; padding: 15px; background: linear-gradient(135deg, var(--primary-color), var(--secondary-color)); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.3s ease;">
                                <i class="fas fa-plus-circle"></i> Agregar Salón
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Inicializar funcionalidades del formulario
    initializeFormFeatures();
}

// Inicializar características del formulario
function initializeFormFeatures() {
    // Vista previa de imágenes
    const mainImageInput = document.getElementById('mainImage');
    const galleryInput = document.getElementById('galleryImages');
    
    if (mainImageInput) {
        mainImageInput.addEventListener('blur', updateImagePreview);
    }
    if (galleryInput) {
        galleryInput.addEventListener('blur', updateImagePreview);
    }
}

// Actualizar vista previa de imágenes
function updateImagePreview() {
    const previewContainer = document.getElementById('previewContainer');
    const imagePreview = document.getElementById('imagePreview');
    
    if (!previewContainer) return;
    
    const mainImage = document.getElementById('mainImage').value;
    const galleryText = document.getElementById('galleryImages').value;
    const galleryUrls = galleryText ? galleryText.split(',').map(url => url.trim()).filter(url => url) : [];
    
    let previewHTML = '';
    
    // Imagen principal
    if (mainImage) {
        previewHTML += `
            <div style="text-align: center;">
                <div style="font-size: 0.8rem; color: #666; margin-bottom: 5px;">Principal</div>
                <img src="${mainImage}" alt="Vista previa" 
                     style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px; border: 2px solid var(--primary-color);"
                     onerror="this.style.display='none'">
            </div>
        `;
    }
    
    // Galería
    galleryUrls.forEach((url, index) => {
        previewHTML += `
            <div style="text-align: center;">
                <div style="font-size: 0.7rem; color: #666; margin-bottom: 5px;">${index + 1}</div>
                <img src="${url}" alt="Galería ${index + 1}" 
                     style="width: 60px; height: 60px; object-fit: cover; border-radius: 6px; border: 1px solid #ddd;"
                     onerror="this.style.display='none'">
            </div>
        `;
    });
    
    previewContainer.innerHTML = previewHTML;
    
    // Mostrar/ocultar sección de vista previa
    if (mainImage || galleryUrls.length > 0) {
        imagePreview.style.display = 'block';
    } else {
        imagePreview.style.display = 'none';
    }
}

// Manejar envío del formulario
function handleAddSalonSubmit(event) {
    event.preventDefault();
    
    // Validar formulario
    if (!validateAddSalonForm()) {
        return;
    }
    
    // Recoger datos del formulario
    const formData = {
        name: document.getElementById('salonName').value.trim(),
        description: document.getElementById('salonDescription').value.trim(),
        image: document.getElementById('mainImage').value.trim(),
        gallery: document.getElementById('galleryImages').value 
                ? document.getElementById('galleryImages').value.split(',').map(url => url.trim()).filter(url => url)
                : [],
        lat: parseFloat(document.getElementById('salonLat').value),
        lng: parseFloat(document.getElementById('salonLng').value),
        capacity: document.getElementById('salonCapacity').value ? parseInt(document.getElementById('salonCapacity').value) : null,
        price: document.getElementById('salonPrice').value || null,
        features: getSelectedFeatures()
    };
    
    // Validar coordenadas
    if (isNaN(formData.lat) || isNaN(formData.lng)) {
        notifier.show('Las coordenadas deben ser números válidos', 'error', 3000);
        return;
    }
    
    // Validar URLs de imágenes
    if (!isValidUrl(formData.image)) {
        notifier.show('La URL de la imagen principal no es válida', 'error', 3000);
        return;
    }
    
    // Mostrar loading
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Agregando...';
    submitBtn.disabled = true;
    
    // Simular procesamiento (en caso real aquí iría la llamada a la API)
    setTimeout(() => {
        try {
            // Guardar en la base de datos
            appDatabase.addSalon(formData)
            
            // Cerrar modal
            closeAddSalonModal();
            
            // Mostrar notificación de éxito
            notifier.show('🎉 Salón agregado exitosamente!', 'success', 4000);
            
            // Actualizar vistas
            loadAdminSalones();
            if (typeof loadSalones === 'function') {
                loadSalones();
            }
            
        } catch (error) {
            notifier.show('❌ Error al agregar salón: ' + error.message, 'error', 5000);
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }, 1000);
}

// Validar formulario
function validateAddSalonForm() {
    const requiredFields = [
        { id: 'salonName', name: 'Nombre del salón' },
        { id: 'salonDescription', name: 'Descripción' },
        { id: 'mainImage', name: 'Imagen principal' },
        { id: 'salonLat', name: 'Latitud' },
        { id: 'salonLng', name: 'Longitud' }
    ];
    
    for (let field of requiredFields) {
        const element = document.getElementById(field.id);
        if (!element.value.trim()) {
            notifier.show(`El campo "${field.name}" es requerido`, 'error', 3000);
            element.focus();
            element.style.borderColor = 'var(--danger-color)';
            return false;
        }
        element.style.borderColor = '#e9ecef';
    }
    
    return true;
}

// Obtener características seleccionadas
function getSelectedFeatures() {
    const checkboxes = document.querySelectorAll('input[name="features"]:checked');
    return Array.from(checkboxes).map(cb => cb.value);
}

// Validar URL
function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

// Cerrar modal de agregar salón
function closeAddSalonModal() {
    const modal = document.getElementById('addSalonModal');
    if (modal) {
        modal.remove();
    }
}

// Mostrar formulario profesional para editar salón
function editSalon(salonId) {
    if (!isAdmin) {
        notifier.show('Debe iniciar sesión como administrador', 'error', 3000);
        return;
    }

    const salones = appDatabase.getAllSalones();
    const salon = salones.find(s => s.id === salonId);
    if (!salon) {
        notifier.show('Salón no encontrado', 'error', 3000);
        return;
    }

    const modalHTML = `
        <div class="modal-overlay" id="editSalonModal">
            <div class="modal-content" style="max-width: 600px; max-height: 90vh; overflow-y: auto;">
                <div style="padding: 25px; position: relative;">
                    <!-- Header del modal -->
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; padding-bottom: 15px; border-bottom: 2px solid #f0f0f0;">
                        <h3 style="margin: 0; color: var(--primary-color); display: flex; align-items: center; gap: 10px;">
                            <i class="fas fa-edit"></i> Editar Salón
                        </h3>
                        <button onclick="closeEditSalonModal()" style="background: none; border: none; font-size: 24px; color: #999; cursor: pointer; padding: 5px; border-radius: 50%; transition: all 0.3s ease;">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>

                    <!-- Información del salón actual -->
                    <div style="background: linear-gradient(135deg, #f8f9fa, #e9ecef); padding: 15px; border-radius: 10px; margin-bottom: 20px; border-left: 4px solid var(--secondary-color);">
                        <h4 style="margin: 0 0 10px 0; color: var(--dark-color); display: flex; align-items: center; gap: 8px;">
                            <i class="fas fa-info-circle"></i> Editando: ${salon.name}
                        </h4>
                        <p style="margin: 0; color: #666; font-size: 0.9rem;">
                            ID: ${salon.id} | ${salon.comments ? salon.comments.length : 0} comentarios | 
                            Rating: ${getAverageRating(salon).toFixed(1)} ⭐
                        </p>
                    </div>

                    <!-- Formulario -->
                    <form id="editSalonForm" onsubmit="handleEditSalonSubmit(event, ${salonId})">
                        <!-- Información Básica -->
                        <div class="form-section" style="margin-bottom: 30px;">
                            <h4 style="color: var(--secondary-color); margin-bottom: 15px; display: flex; align-items: center; gap: 8px;">
                                <i class="fas fa-info-circle"></i> Información Básica
                            </h4>
                            
                            <div class="form-group">
                                <label for="editSalonName" style="display: block; margin-bottom: 8px; font-weight: 600; color: #333;">
                                    <i class="fas fa-signature"></i> Nombre del Salón *
                                </label>
                                <input type="text" id="editSalonName" class="form-control" required 
                                       value="${salon.name}"
                                       placeholder="Ej: Fiesta Mágica Infantil" 
                                       style="width: 100%; padding: 12px 15px; border: 2px solid #e9ecef; border-radius: 8px; font-size: 1rem; transition: all 0.3s ease;">
                                <div class="form-hint" style="font-size: 0.85rem; color: #666; margin-top: 5px;">
                                    Nombre comercial del salón de fiestas
                                </div>
                            </div>

                            <div class="form-group">
                                <label for="editSalonDescription" style="display: block; margin-bottom: 8px; font-weight: 600; color: #333;">
                                    <i class="fas fa-align-left"></i> Descripción *
                                </label>
                                <textarea id="editSalonDescription" class="form-control" required rows="4"
                                          placeholder="Describa las características, servicios y atracciones del salón..."
                                          style="width: 100%; padding: 12px 15px; border: 2px solid #e9ecef; border-radius: 8px; font-size: 1rem; resize: vertical; transition: all 0.3s ease;">${salon.description}</textarea>
                                <div class="form-hint" style="font-size: 0.85rem; color: #666; margin-top: 5px;">
                                    Incluya información sobre temáticas, capacidad, servicios incluidos, etc.
                                </div>
                            </div>
                        </div>

                        <!-- Imágenes -->
                        <div class="form-section" style="margin-bottom: 30px;">
                            <h4 style="color: var(--secondary-color); margin-bottom: 15px; display: flex; align-items: center; gap: 8px;">
                                <i class="fas fa-images"></i> Imágenes
                            </h4>
                            
                            <div class="form-group">
                                <label for="editMainImage" style="display: block; margin-bottom: 8px; font-weight: 600; color: #333;">
                                    <i class="fas fa-image"></i> Imagen Principal *
                                </label>
                                <input type="url" id="editMainImage" class="form-control" required 
                                       value="${salon.image}"
                                       placeholder="https://ejemplo.com/imagen-principal.jpg"
                                       style="width: 100%; padding: 12px 15px; border: 2px solid #e9ecef; border-radius: 8px; font-size: 1rem; transition: all 0.3s ease;">
                                <div class="form-hint" style="font-size: 0.85rem; color: #666; margin-top: 5px;">
                                    URL de la imagen que se mostrará como portada
                                </div>
                            </div>

                            <div class="form-group">
                                <label for="editGalleryImages" style="display: block; margin-bottom: 8px; font-weight: 600; color: #333;">
                                    <i class="fas fa-photo-video"></i> Galería de Imágenes
                                </label>
                                <textarea id="editGalleryImages" class="form-control" rows="3"
                                          placeholder="https://ejemplo.com/imagen1.jpg, https://ejemplo.com/imagen2.jpg"
                                          style="width: 100%; padding: 12px 15px; border: 2px solid #e9ecef; border-radius: 8px; font-size: 1rem; resize: vertical; transition: all 0.3s ease;">${salon.gallery ? salon.gallery.join(', ') : ''}</textarea>
                                <div class="form-hint" style="font-size: 0.85rem; color: #666; margin-top: 5px;">
                                    URLs separadas por comas. Mínimo recomendado: 3 imágenes
                                </div>
                            </div>

                            <!-- Vista previa de imágenes actuales -->
                            <div style="margin-top: 15px;">
                                <h5 style="margin-bottom: 10px; color: #666; font-size: 0.9rem;">Imágenes Actuales:</h5>
                                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(80px, 1fr)); gap: 10px; margin-bottom: 15px;">
                                    <div style="text-align: center;">
                                        <div style="font-size: 0.8rem; color: #666; margin-bottom: 5px;">Principal</div>
                                        <img src="${salon.image}" alt="Actual" 
                                             style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px; border: 2px solid var(--primary-color);"
                                             onerror="this.src='https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop'">
                                    </div>
                                    ${salon.gallery && salon.gallery.length > 0 ? salon.gallery.map((img, index) => `
                                        <div style="text-align: center;">
                                            <div style="font-size: 0.7rem; color: #666; margin-bottom: 5px;">${index + 1}</div>
                                            <img src="${img}" alt="Galería ${index + 1}" 
                                                 style="width: 60px; height: 60px; object-fit: cover; border-radius: 6px; border: 1px solid #ddd;"
                                                 onerror="this.style.display='none'">
                                        </div>
                                    `).join('') : ''}
                                </div>
                            </div>

                            <!-- Vista previa de nuevas imágenes -->
                            <div id="editImagePreview" style="margin-top: 15px; display: none;">
                                <h5 style="margin-bottom: 10px; color: #666; font-size: 0.9rem;">Vista Previa de Cambios:</h5>
                                <div id="editPreviewContainer" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(80px, 1fr)); gap: 10px;"></div>
                            </div>
                        </div>

                        <!-- Ubicación -->
                        <div class="form-section" style="margin-bottom: 30px;">
                            <h4 style="color: var(--secondary-color); margin-bottom: 15px; display: flex; align-items: center; gap: 8px;">
                                <i class="fas fa-map-marker-alt"></i> Ubicación
                            </h4>
                            
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                                <div class="form-group">
                                    <label for="editSalonLat" style="display: block; margin-bottom: 8px; font-weight: 600; color: #333;">
                                        <i class="fas fa-globe-americas"></i> Latitud *
                                    </label>
                                    <input type="number" id="editSalonLat" class="form-control" required step="any"
                                           value="${salon.lat}"
                                           placeholder="Ej: -34.603722"
                                           style="width: 100%; padding: 12px 15px; border: 2px solid #e9ecef; border-radius: 8px; font-size: 1rem; transition: all 0.3s ease;">
                                </div>

                                <div class="form-group">
                                    <label for="editSalonLng" style="display: block; margin-bottom: 8px; font-weight: 600; color: #333;">
                                        <i class="fas fa-globe-americas"></i> Longitud *
                                    </label>
                                    <input type="number" id="editSalonLng" class="form-control" required step="any"
                                           value="${salon.lng}"
                                           placeholder="Ej: -58.381592"
                                           style="width: 100%; padding: 12px 15px; border: 2px solid #e9ecef; border-radius: 8px; font-size: 1rem; transition: all 0.3s ease;">
                                </div>
                            </div>
                            
                            <div class="form-hint" style="font-size: 0.85rem; color: #666; margin-top: 10px; background: #f8f9fa; padding: 10px; border-radius: 5px;">
                                <i class="fas fa-info-circle"></i> 
                                Puede obtener las coordenadas desde 
                                <a href="https://www.google.com/maps" target="_blank" style="color: var(--primary-color);">Google Maps</a>. 
                                Haga clic derecho en el lugar y seleccione "¿Qué hay aquí?"
                            </div>
                        </div>

                        <!-- Información Adicional -->
                        <div class="form-section" style="margin-bottom: 30px;">
                            <h4 style="color: var(--secondary-color); margin-bottom: 15px; display: flex; align-items: center; gap: 8px;">
                                <i class="fas fa-star"></i> Información Adicional
                            </h4>
                            
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                                <div class="form-group">
                                    <label for="editSalonCapacity" style="display: block; margin-bottom: 8px; font-weight: 600; color: #333;">
                                        <i class="fas fa-users"></i> Capacidad
                                    </label>
                                    <input type="number" id="editSalonCapacity" class="form-control" 
                                           value="${salon.capacity || ''}"
                                           placeholder="Ej: 50"
                                           style="width: 100%; padding: 12px 15px; border: 2px solid #e9ecef; border-radius: 8px; font-size: 1rem; transition: all 0.3s ease;">
                                </div>

                                <div class="form-group">
                                    <label for="editSalonPrice" style="display: block; margin-bottom: 8px; font-weight: 600; color: #333;">
                                        <i class="fas fa-tag"></i> Precio Base
                                    </label>
                                    <input type="text" id="editSalonPrice" class="form-control" 
                                           value="${salon.price || ''}"
                                           placeholder="Ej: $50,000"
                                           style="width: 100%; padding: 12px 15px; border: 2px solid #e9ecef; border-radius: 8px; font-size: 1rem; transition: all 0.3s ease;">
                                </div>
                            </div>

                            <div class="form-group">
                                <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #333;">
                                    <i class="fas fa-check-circle"></i> Características
                                </label>
                                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px;">
                                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                                        <input type="checkbox" name="editFeatures" value="parque_inflable" ${salon.features && salon.features.includes('parque_inflable') ? 'checked' : ''}> 
                                        <i class="fas fa-cloud" style="color: #ff6b8b;"></i> Parque Inflable
                                    </label>
                                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                                        <input type="checkbox" name="editFeatures" value="animacion" ${salon.features && salon.features.includes('animacion') ? 'checked' : ''}> 
                                        <i class="fas fa-magic" style="color: #845ec2;"></i> Animación
                                    </label>
                                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                                        <input type="checkbox" name="editFeatures" value="catering" ${salon.features && salon.features.includes('catering') ? 'checked' : ''}> 
                                        <i class="fas fa-utensils" style="color: #ff9671;"></i> Catering
                                    </label>
                                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                                        <input type="checkbox" name="editFeatures" value="decoracion" ${salon.features && salon.features.includes('decoracion') ? 'checked' : ''}> 
                                        <i class="fas fa-palette" style="color: #00c9a7;"></i> Decoración
                                    </label>
                                </div>
                            </div>
                        </div>

                        <!-- Estadísticas (solo lectura) -->
                        <div class="form-section" style="margin-bottom: 30px; background: #f0f8ff; border-left-color: #007bff;">
                            <h4 style="color: #007bff; margin-bottom: 15px; display: flex; align-items: center; gap: 8px;">
                                <i class="fas fa-chart-bar"></i> Estadísticas del Salón
                            </h4>
                            
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 15px; text-align: center;">
                                <div style="background: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                    <div style="font-size: 1.5rem; font-weight: bold; color: var(--primary-color);">
                                        ${salon.comments ? salon.comments.length : 0}
                                    </div>
                                    <div style="font-size: 0.8rem; color: #666;">Comentarios</div>
                                </div>
                                <div style="background: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                    <div style="font-size: 1.5rem; font-weight: bold; color: var(--warning-color);">
                                        ${getAverageRating(salon).toFixed(1)}
                                    </div>
                                    <div style="font-size: 0.8rem; color: #666;">Rating Promedio</div>
                                </div>
                                <div style="background: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                    <div style="font-size: 1.5rem; font-weight: bold; color: var(--success-color);">
                                        ${salon.id}
                                    </div>
                                    <div style="font-size: 0.8rem; color: #666;">ID del Salón</div>
                                </div>
                            </div>
                        </div>

                        <!-- Botones de acción -->
                        <div style="display: flex; gap: 15px; margin-top: 30px; padding-top: 20px; border-top: 2px solid #f0f0f0;">
                            <button type="button" onclick="closeEditSalonModal()" 
                                    style="flex: 1; padding: 15px; background: #6c757d; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.3s ease;">
                                <i class="fas fa-times"></i> Cancelar
                            </button>
                            <button type="submit" 
                                    style="flex: 2; padding: 15px; background: linear-gradient(135deg, var(--warning-color), #ff9a44); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.3s ease;">
                                <i class="fas fa-save"></i> Guardar Cambios
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Inicializar funcionalidades del formulario
    initializeEditFormFeatures();
}

// Inicializar características del formulario de edición
function initializeEditFormFeatures() {
    // Vista previa de imágenes
    const mainImageInput = document.getElementById('editMainImage');
    const galleryInput = document.getElementById('editGalleryImages');
    
    if (mainImageInput) {
        mainImageInput.addEventListener('blur', updateEditImagePreview);
    }
    if (galleryInput) {
        galleryInput.addEventListener('blur', updateEditImagePreview);
    }
}

// Actualizar vista previa de imágenes en edición
function updateEditImagePreview() {
    const previewContainer = document.getElementById('editPreviewContainer');
    const imagePreview = document.getElementById('editImagePreview');
    
    if (!previewContainer) return;
    
    const mainImage = document.getElementById('editMainImage').value;
    const galleryText = document.getElementById('editGalleryImages').value;
    const galleryUrls = galleryText ? galleryText.split(',').map(url => url.trim()).filter(url => url) : [];
    
    let previewHTML = '';
    
    // Imagen principal
    if (mainImage) {
        previewHTML += `
            <div style="text-align: center;">
                <div style="font-size: 0.8rem; color: #666; margin-bottom: 5px;">Nueva Principal</div>
                <img src="${mainImage}" alt="Vista previa" 
                     style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px; border: 2px solid var(--warning-color);"
                     onerror="this.style.display='none'">
            </div>
        `;
    }
    
    // Galería
    galleryUrls.forEach((url, index) => {
        previewHTML += `
            <div style="text-align: center;">
                <div style="font-size: 0.7rem; color: #666; margin-bottom: 5px;">Nueva ${index + 1}</div>
                <img src="${url}" alt="Galería ${index + 1}" 
                     style="width: 60px; height: 60px; object-fit: cover; border-radius: 6px; border: 1px solid var(--warning-color);"
                     onerror="this.style.display='none'">
            </div>
        `;
    });
    
    previewContainer.innerHTML = previewHTML;
    
    // Mostrar/ocultar sección de vista previa
    if (mainImage || galleryUrls.length > 0) {
        imagePreview.style.display = 'block';
    } else {
        imagePreview.style.display = 'none';
    }
}

// Manejar envío del formulario de edición
function handleEditSalonSubmit(event, salonId) {
    event.preventDefault();
    
    // Validar formulario
    if (!validateEditSalonForm()) {
        return;
    }
    
    // Recoger datos del formulario
    const formData = {
        name: document.getElementById('editSalonName').value.trim(),
        description: document.getElementById('editSalonDescription').value.trim(),
        image: document.getElementById('editMainImage').value.trim(),
        gallery: document.getElementById('editGalleryImages').value 
                ? document.getElementById('editGalleryImages').value.split(',').map(url => url.trim()).filter(url => url)
                : [],
        lat: parseFloat(document.getElementById('editSalonLat').value),
        lng: parseFloat(document.getElementById('editSalonLng').value),
        capacity: document.getElementById('editSalonCapacity').value ? parseInt(document.getElementById('editSalonCapacity').value) : null,
        price: document.getElementById('editSalonPrice').value || null,
        features: getSelectedEditFeatures()
    };
    
    // Validar coordenadas
    if (isNaN(formData.lat) || isNaN(formData.lng)) {
        notifier.show('Las coordenadas deben ser números válidos', 'error', 3000);
        return;
    }
    
    // Validar URLs de imágenes
    if (!isValidUrl(formData.image)) {
        notifier.show('La URL de la imagen principal no es válida', 'error', 3000);
        return;
    }
    
    // Mostrar loading
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';
    submitBtn.disabled = true;
    
    // Simular procesamiento
    setTimeout(() => {
        try {
            // Actualizar en la base de datos
            const success = appDatabase.updateSalon(salonId, formData);
            
            if (success) {
                // Cerrar modal
                closeEditSalonModal();
                
                // Mostrar notificación de éxito
                notifier.show('✅ Salón actualizado exitosamente!', 'success', 4000);
                
                // Actualizar vistas
                loadAdminSalones();
                if (typeof loadSalones === 'function') {
                    loadSalones();
                }
            } else {
                throw new Error('No se pudo actualizar el salón');
            }
            
        } catch (error) {
            notifier.show('❌ Error al actualizar salón: ' + error.message, 'error', 5000);
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }, 1000);
}

// Validar formulario de edición
function validateEditSalonForm() {
    const requiredFields = [
        { id: 'editSalonName', name: 'Nombre del salón' },
        { id: 'editSalonDescription', name: 'Descripción' },
        { id: 'editMainImage', name: 'Imagen principal' },
        { id: 'editSalonLat', name: 'Latitud' },
        { id: 'editSalonLng', name: 'Longitud' }
    ];
    
    for (let field of requiredFields) {
        const element = document.getElementById(field.id);
        if (!element.value.trim()) {
            notifier.show(`El campo "${field.name}" es requerido`, 'error', 3000);
            element.focus();
            element.style.borderColor = 'var(--danger-color)';
            return false;
        }
        element.style.borderColor = '#e9ecef';
    }
    
    return true;
}

// Obtener características seleccionadas en edición
function getSelectedEditFeatures() {
    const checkboxes = document.querySelectorAll('input[name="editFeatures"]:checked');
    return Array.from(checkboxes).map(cb => cb.value);
}

// Cerrar modal de editar salón
function closeEditSalonModal() {
    const modal = document.getElementById('editSalonModal');
    if (modal) {
        modal.remove();
    }
}

// Eliminar salón
function deleteSalon(salonId) {
    if (!isAdmin) {
        notifier.show('Debe iniciar sesión como administrador', 'error', 3000);
        return;
    }
    
    if (!confirm('¿Estás seguro de que quieres eliminar este salón? Esta acción no se puede deshacer.')) {
        return;
    }
    
    try {
        appDatabase.deleteSalon(salonId);
        notifier.show('Salón eliminado exitosamente', 'success', 3000);
        loadAdminSalones();
        if (typeof loadSalones === 'function') {
            loadSalones();
        }
    } catch (error) {
        notifier.show('Error al eliminar salón: ' + error.message, 'error', 5000);
    }
}

// Eliminar comentario
function deleteComment(salonId, username) {
    if (!isAdmin) {
        notifier.show('Debe iniciar sesión como administrador', 'error', 3000);
        return;
    }
    
    if (!confirm('¿Estás seguro de que quieres eliminar este comentario?')) {
        return;
    }
    
    try {
        const success = appDatabase.deleteComment(salonId, username);
        if (success) {
            notifier.show('Comentario eliminado exitosamente', 'success', 3000);
            loadAdminSalones();
            if (typeof loadSalones === 'function') {
                loadSalones();
            }
        } else {
            notifier.show('Error al eliminar comentario', 'error', 3000);
        }
    } catch (error) {
        notifier.show('Error al eliminar comentario: ' + error.message, 'error', 5000);
    }
}

// Actualizar datos
function refreshData() {
    loadAdminSalones();
    notifier.show('Datos actualizados', 'success', 2000);
}

// Restablecer datos
function resetData() {
    if (!isAdmin) {
        notifier.show('Debe iniciar sesión como administrador', 'error', 3000);
        return;
    }
    
    if (!confirm('¿Estás seguro de que quieres restablecer todos los datos a los valores de ejemplo? Se perderán todos los cambios.')) {
        return;
    }
    
    try {
        appDatabase.resetToSampleData();
        notifier.show('Datos restablecidos exitosamente', 'success', 3000);
        loadAdminSalones();
        if (typeof loadSalones === 'function') {
            loadSalones();
        }
    } catch (error) {
        notifier.show('Error al restablecer datos: ' + error.message, 'error', 5000);
    }
}

// Hacer funciones disponibles globalmente
window.handleAdminAccess = handleAdminAccess;
window.verifyAdminCredentials = verifyAdminCredentials;
window.closeAdminLoginModal = closeAdminLoginModal;
window.handleAdminPasswordKeypress = handleAdminPasswordKeypress;
window.logoutAdmin = logoutAdmin;
window.closeAdminPanel = closeAdminPanel;
window.editSalon = editSalon;
window.deleteSalon = deleteSalon;
window.deleteComment = deleteComment;
window.showAddSalonForm = showAddSalonForm;
window.closeAddSalonModal = closeAddSalonModal;
window.handleAddSalonSubmit = handleAddSalonSubmit;
window.editSalon = editSalon;
window.closeEditSalonModal = closeEditSalonModal;
window.handleEditSalonSubmit = handleEditSalonSubmit;
window.initializeEditFormFeatures = initializeEditFormFeatures;
window.updateEditImagePreview = updateEditImagePreview;
window.getSelectedEditFeatures = getSelectedEditFeatures;
window.validateEditSalonForm = validateEditSalonForm;
