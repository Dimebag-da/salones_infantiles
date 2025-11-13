// Variables globales
let salones = [];
let filteredSalones = [];

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎬 DOM cargado - Iniciando aplicación');
    initializeApp();
});

function initializeApp() {
    console.log('🔄 Inicializando aplicación...');
    showLoadingState();
    
    // Pequeño delay para asegurar que database.js se cargue
    setTimeout(() => {
        loadSalones();
        setupEventListeners();
    }, 100);
}

function showLoadingState() {
    const container = document.getElementById('salonesContainer');
    if (container) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
                <div class="spinner" style="width: 50px; height: 50px; border: 5px solid #f3f3f3; border-top: 5px solid #ff6b8b; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px;"></div>
                <p style="color: #666; font-size: 1.1rem;">Cargando salones...</p>
            </div>
        `;
    }
}

function loadSalones() {
    console.log('📥 Cargando salones...');
    
    try {
        // Verificar que appDatabase esté disponible
        if (typeof appDatabase === 'undefined') {
            throw new Error('appDatabase no está disponible');
        }
        
        const salonesData = appDatabase.getAllSalones();
        console.log('📊 Datos obtenidos:', salonesData);
        
        if (!Array.isArray(salonesData)) {
            throw new Error('Los datos no son un array válido');
        }
        
        salones = salonesData;
        filteredSalones = [...salones];
        
        console.log('✅ Salones cargados:', salones.length);
        renderSalones();
        
    } catch (error) {
        console.error('❌ Error al cargar salones:', error);
        showErrorState('Error: ' + error.message);
    }
}

function showErrorState(message) {
    const container = document.getElementById('salonesContainer');
    if (container) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: white; border-radius: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <i class="fas fa-exclamation-triangle" style="font-size: 4rem; color: #ff6b6b; margin-bottom: 20px;"></i>
                <h3 style="color: #ff6b6b; margin-bottom: 15px;">Error de carga</h3>
                <p style="color: #666; margin-bottom: 25px;">${message}</p>
                <button class="btn btn-primary" onclick="location.reload()" style="padding: 10px 20px; background: #ff6b8b; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    <i class="fas fa-redo"></i> Recargar Página
                </button>
            </div>
        `;
    }
}

function renderSalones() {
    const container = document.getElementById('salonesContainer');
    
    if (!container) {
        console.error('❌ No se encontró el contenedor');
        return;
    }
    
    console.log('🎨 Renderizando', filteredSalones.length, 'salones');
    
    if (filteredSalones.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: #666;">
                <i class="fas fa-search" style="font-size: 3rem; color: #ccc; margin-bottom: 1rem;"></i>
                <h3>No se encontraron salones</h3>
                <p>Intenta con otros términos de búsqueda</p>
            </div>
        `;
        return;
    }
    
    // Crear HTML de los salones - VERSIÓN CORREGIDA
    container.innerHTML = filteredSalones.map(salon => {
        const averageRating = getAverageRating(salon);
        const reviewCount = salon.comments ? salon.comments.length : 0;
        
        return `
        <div class="salon-card" style="background: white; border-radius: 15px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: all 0.3s ease;">
            <div class="gallery" style="position: relative; height: 200px; overflow: hidden;">
                <img src="${salon.image}" alt="${salon.name}" 
                     class="gallery-image" 
                     style="width: 100%; height: 100%; object-fit: cover;"
                     onerror="this.src='https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop'">
            </div>
            
            <div class="salon-content" style="padding: 20px;">
                <h3 class="salon-name" style="color: #ff6b8b; font-size: 1.5rem; margin: 0 0 10px 0; font-weight: 700;">
                    ${salon.name}
                </h3>
                
                <p class="salon-description" style="color: #666; margin: 0 0 15px 0; font-size: 0.95rem; line-height: 1.5;">
                    ${salon.description}
                </p>
                
                <div class="salon-rating" style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
                    <div class="stars" style="color: #ffc107;">
                        ${generateStars(averageRating)}
                    </div>
                    <span class="rating-value" style="font-weight: 600; color: #333;">
                        ${averageRating.toFixed(1)}
                    </span>
                    <span class="review-count" style="color: #666; font-size: 0.9em;">
                        (${reviewCount} reseña${reviewCount !== 1 ? 's' : ''})
                    </span>
                </div>
                
                <div class="salon-actions" style="display: flex; gap: 10px;">
                    <button class="btn btn-primary" onclick="openComments(${salon.id})" style="flex: 1; padding: 10px; background: #ff6b8b; color: white; border: none; border-radius: 5px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 5px; transition: all 0.3s ease;">
                        <i class="fas fa-comments"></i> Comentarios
                    </button>
                    
                    <button class="btn btn-outline" 
                            onclick="viewSalonDetails(${salon.id})"
                            style="flex: 1; padding: 10px; background: transparent; color: #ff6b8b; border: 2px solid #ff6b8b; border-radius: 5px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 5px; transition: all 0.3s ease;">
                        <i class="fas fa-eye"></i> Ver Más
                    </button>
                    
                    <button class="btn btn-secondary" 
                            onclick="openInMaps(${salon.lat}, ${salon.lng})"
                            style="flex: 1; padding: 10px; background: #845ec2; color: white; border: none; border-radius: 5px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 5px; transition: all 0.3s ease;">
                        <i class="fas fa-map-marker-alt"></i> Maps
                    </button>
                </div>
            </div>
        </div>
        `;
    }).join('');
    
    console.log('✅ Salones renderizados correctamente');
    
    // Agregar estilos hover para las tarjetas
    const salonCards = container.querySelectorAll('.salon-card');
    salonCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        });
    });
    
    // Agregar estilos hover para los botones
    const buttons = container.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            if (this.classList.contains('btn-primary')) {
                this.style.background = '#ff4d7a';
                this.style.transform = 'translateY(-2px)';
            } else if (this.classList.contains('btn-outline')) {
                this.style.background = '#ff6b8b';
                this.style.color = 'white';
                this.style.transform = 'translateY(-2px)';
            } else if (this.classList.contains('btn-secondary')) {
                this.style.background = '#6b4cb3';
                this.style.transform = 'translateY(-2px)';
            }
        });
        
        button.addEventListener('mouseleave', function() {
            if (this.classList.contains('btn-primary')) {
                this.style.background = '#ff6b8b';
                this.style.transform = 'translateY(0)';
            } else if (this.classList.contains('btn-outline')) {
                this.style.background = 'transparent';
                this.style.color = '#ff6b8b';
                this.style.transform = 'translateY(0)';
            } else if (this.classList.contains('btn-secondary')) {
                this.style.background = '#845ec2';
                this.style.transform = 'translateY(0)';
            }
        });
    });
}

function setupEventListeners() {
    console.log('🔧 Configurando event listeners...');
    
    // Búsqueda en tiempo real
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            filteredSalones = salones.filter(salon => 
                salon.name.toLowerCase().includes(searchTerm) ||
                salon.description.toLowerCase().includes(searchTerm)
            );
            renderSalones();
        });
    }
    
    // Modal de comentarios
    const modal = document.getElementById('commentsModal');
    const closeBtn = document.querySelector('.close');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            console.log('❌ Cerrando modal...');
            modal.style.display = 'none';
        });
    }
    
    // Cerrar modal al hacer clic fuera del contenido
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            console.log('📌 Clic fuera del modal, cerrando...');
            modal.style.display = 'none';
        }
    });

    // Botón de administración (si existe)
    const adminBtn = document.getElementById('adminBtn');
    if (adminBtn) {
        adminBtn.addEventListener('click', function() {
            if (typeof handleAdminAccess === 'function') {
                handleAdminAccess();
            }
        });
    }
}

// Función para cerrar modal desde cualquier lugar
function closeModal() {
    const modal = document.getElementById('commentsModal');
    if (modal) {
        console.log('🔒 Cerrando modal mediante función');
        modal.style.display = 'none';
    }
}

// Hacerla disponible globalmente
window.closeModal = closeModal;

// Añadir estilos de animación
if (!document.querySelector('#app-styles')) {
    const style = document.createElement('style');
    style.id = 'app-styles';
    style.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
}

// Función para ver detalles completos del salón
function viewSalonDetails(salonId) {
    console.log('🔍 Abriendo detalles para salón:', salonId);
    
    const salones = appDatabase.getAllSalones();
    const salon = salones.find(s => s.id === salonId);
    
    if (!salon) {
        showNotification('Salón no encontrado', 'error');
        return;
    }
    
    const modal = document.getElementById('commentsModal');
    const modalContent = document.getElementById('modalContent');
    
    if (!modal || !modalContent) return;
    
    const averageRating = getAverageRating(salon);
    const reviewCount = salon.comments ? salon.comments.length : 0;
    
    modalContent.innerHTML = `
        <div style="position: relative;">
            <button onclick="closeModal()" style="position: absolute; right: 15px; top: 15px; background: rgba(255,255,255,0.9); border: none; font-size: 24px; cursor: pointer; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; z-index: 100; transition: all 0.3s ease;">
                &times;
            </button>
            
            <div style="padding: 20px; border-bottom: 1px solid #eee; background: linear-gradient(135deg, #ff6b8b, #845ec2); color: white; border-radius: 15px 15px 0 0; padding-top: 60px;">
                <h2 style="margin: 0; font-size: 1.8rem;">${salon.name}</h2>
                <p style="margin: 5px 0 0; opacity: 0.9;">
                    <i class="fas fa-star" style="color: #ffc107;"></i> ${averageRating.toFixed(1)} • 
                    <i class="fas fa-comments"></i> ${reviewCount} reseñas
                </p>
            </div>
        </div>
        
        <div style="padding: 20px; max-height: 70vh; overflow-y: auto;">
            <!-- Galería de imágenes -->
            <div style="margin-bottom: 20px;">
                <img src="${salon.image}" alt="${salon.name}" 
                     style="width: 100%; height: 250px; object-fit: cover; border-radius: 10px; margin-bottom: 10px;">
                
                ${salon.gallery && salon.gallery.length > 1 ? `
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 10px; margin-top: 10px;">
                        ${salon.gallery.map((img, index) => `
                            <img src="${img}" alt="Galería ${index + 1}" 
                                 style="width: 100%; height: 80px; object-fit: cover; border-radius: 5px; cursor: pointer; border: 2px solid transparent; transition: all 0.3s ease;"
                                 onmouseover="this.style.borderColor='#ff6b8b'; this.style.transform='scale(1.05)'" 
                                 onmouseout="this.style.borderColor='transparent'; this.style.transform='scale(1)'"
                                 onclick="this.closest('.modal-content').querySelector('img').src = '${img}'">
                        `).join('')}
                    </div>
                ` : ''}
            </div>
            
            <!-- Descripción -->
            <div style="margin-bottom: 20px;">
                <h3 style="color: #ff6b8b; margin-bottom: 10px; display: flex; align-items: center; gap: 10px;">
                    <i class="fas fa-info-circle"></i> Descripción
                </h3>
                <p style="line-height: 1.6; color: #555; background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 0;">
                    ${salon.description}
                </p>
            </div>
            
            <!-- Información de ubicación -->
            <div style="margin-bottom: 20px;">
                <h3 style="color: #ff6b8b; margin-bottom: 10px; display: flex; align-items: center; gap: 10px;">
                    <i class="fas fa-map-marker-alt"></i> Ubicación
                </h3>
                <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; text-align: center;">
                    <div style="font-size: 3rem; color: #ff6b8b; margin-bottom: 10px;">
                        <i class="fas fa-map-pin"></i>
                    </div>
                    <p style="color: #666; margin-bottom: 15px; font-size: 1.1rem;">
                        Ubicación disponible en Google Maps
                    </p>
                    <button onclick="openInMaps(${salon.lat}, ${salon.lng})" 
                            style="padding: 12px 24px; background: linear-gradient(135deg, #845ec2, #6b4cb3); color: white; border: none; border-radius: 25px; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; transition: all 0.3s ease;"
                            onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 5px 15px rgba(0,0,0,0.2)'"
                            onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                        <i class="fas fa-external-link-alt"></i> Ver en Google Maps
                    </button>
                </div>
            </div>
            
            <!-- Acciones rápidas -->
            <div style="display: flex; gap: 10px; margin-top: 20px;">
                <button onclick="closeModal(); setTimeout(() => openComments(${salon.id}), 300)" 
                        style="flex: 1; padding: 15px; background: linear-gradient(135deg, #ff6b8b, #ff4d7a); color: white; border: none; border-radius: 10px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.3s ease;"
                        onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 5px 15px rgba(0,0,0,0.2)'"
                        onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                    <i class="fas fa-comment"></i> Dejar Reseña
                </button>
                
                <button onclick="openInMaps(${salon.lat}, ${salon.lng})" 
                        style="flex: 1; padding: 15px; background: linear-gradient(135deg, #845ec2, #6b4cb3); color: white; border: none; border-radius: 10px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.3s ease;"
                        onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 5px 15px rgba(0,0,0,0.2)'"
                        onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                    <i class="fas fa-directions"></i> Cómo Llegar
                </button>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
}

// Calcular promedio de calificaciones
function getAverageRating(salon) {
    if (!salon.comments || salon.comments.length === 0) return 0;
    
    const sum = salon.comments.reduce((total, comment) => total + comment.rating, 0);
    return sum / salon.comments.length;
}

// Abrir en Google Maps
function openInMaps(lat, lng) {
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
}

// Función para generar estrellas
function generateStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i - 0.5 <= rating) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    return stars;
}

// Hacer funciones globales
window.viewSalonDetails = viewSalonDetails;
window.openInMaps = openInMaps;
window.generateStars = generateStars;
window.getAverageRating = getAverageRating;