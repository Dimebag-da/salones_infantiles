// Sistema de comentarios simplificado
let usedUsernames = new Set();

// 🎨 SISTEMA DE NOTIFICACIONES MEJORADO
class NotificationSystem {
    constructor() {
        this.container = null;
        this.init();
    }

    init() {
        // Crear contenedor de notificaciones
        this.container = document.createElement('div');
        this.container.id = 'notification-container';
        this.container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10002;
            display: flex;
            flex-direction: column;
            gap: 10px;
            max-width: 350px;
        `;
        document.body.appendChild(this.container);
    }

    show(message, type = 'info', duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: '💡'
        };

        notification.innerHTML = `
            <div style="display: flex; align-items: flex-start; gap: 12px;">
                <span style="font-size: 1.2em;">${icons[type] || icons.info}</span>
                <div style="flex: 1;">
                    <div style="font-weight: 600; margin-bottom: 4px;">${this.getTitle(type)}</div>
                    <div style="font-size: 0.9em; line-height: 1.4;">${message}</div>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" 
                        style="background: none; border: none; font-size: 16px; cursor: pointer; color: #666; padding: 0;">
                    ×
                </button>
            </div>
        `;

        // Estilos base
        notification.style.cssText = `
            background: white;
            padding: 16px;
            border-radius: 12px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.15);
            border-left: 4px solid ${this.getColor(type)};
            animation: slideInRight 0.3s ease, fadeOut 0.3s ease ${duration}ms forwards;
            transform: translateX(100%);
            opacity: 0;
            max-width: 350px;
            font-family: Arial, sans-serif;
            font-size: 14px;
        `;

        this.container.appendChild(notification);

        // Animación de entrada
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
            notification.style.opacity = '1';
        }, 10);

        // Auto-eliminar
        if (duration > 0) {
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.style.transform = 'translateX(100%)';
                    notification.style.opacity = '0';
                    setTimeout(() => notification.remove(), 300);
                }
            }, duration);
        }

        return notification;
    }

    getTitle(type) {
        const titles = {
            success: '¡Éxito!',
            error: 'Error',
            warning: 'Advertencia',
            info: 'Información'
        };
        return titles[type] || 'Notificación';
    }

    getColor(type) {
        const colors = {
            success: '#51cf66',
            error: '#ff6b6b',
            warning: '#ffd43b',
            info: '#339af0'
        };
        return colors[type] || '#339af0';
    }
}

// Estilos CSS para las animaciones
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes fadeOut {
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }

    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    .notification {
        transition: all 0.3s ease;
    }
    
    .notification:hover {
        transform: translateY(-2px) !important;
        box-shadow: 0 12px 30px rgba(0,0,0,0.2) !important;
    }
`;
document.head.appendChild(notificationStyles);

// Instanciar el sistema de notificaciones
const notifier = new NotificationSystem();

// 📊 SISTEMA DE FILTRADO PARA DEMOSTRACIÓN
class WordFilter {
    constructor() {
        this.badWords = [
            'tonto', 'tonta', 'estupido', 'estupida', 'idiota', 'imbecil',
            'bruto', 'bruta', 'burro', 'burra', 'inutil', 'retrasado', 'retrasada',
            'tarado', 'tarada', 'baboso', 'babosa',
            'puta', 'puto', 'putos', 'putas',
            'mierda', 'cabron', 'cabrona', 'cojudo', 'cojuda',
            'hijo de puta', 'gil', 'pelotudo', 'pendejo', 'pendeja',
            'maricon', 'maricona', 'culero', 'culera', 'zorra', 'zorro'
        ];
        this.detections = [];
    }

    normalize(text) {
        return text
            .toLowerCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // quitar tildes
            .replace(/[@$!.,_*#%&0-9]/g, '') // quitar símbolos y números
            .replace(/4/g, 'a')
            .replace(/3/g, 'e')
            .replace(/1/g, 'i')
            .replace(/0/g, 'o')
            .replace(/5/g, 's');
    }

    // Verificar si el texto contiene palabras prohibidas - FUNCIÓN CORREGIDA
    isProfane(text) {
        const cleaned = this.normalize(text);
        const detectedWords = this.badWords.filter(word => cleaned.includes(word));
        
        if (detectedWords.length > 0) {
            console.log(`🚫 FILTRO ACTIVADO: Palabras detectadas en "${text}":`, detectedWords);
            
            // Registrar detección
            detectedWords.forEach(word => {
                this.logDetection(word, text);
            });
            
            return true;
        }
        
        return false;
    }

    // Registrar detecciones para la demostración
    logDetection(word, originalText) {
        this.detections.push({
            word: word,
            originalText: originalText,
            timestamp: new Date().toISOString()
        });
        
        console.log(`🚫 FILTRO ACTIVADO: "${word}" detectado en: "${originalText}"`);
    }

    // Obtener reporte para demostración
    getFilterReport() {
        return {
            totalDetections: this.detections.length,
            detections: this.detections,
            badWordsList: this.badWords
        };
    }

    // Mostrar panel de demostración
    showDemoPanel() {
        if (document.getElementById('filterDemoPanel')) return;
        
        const panel = document.createElement('div');
        panel.id = 'filterDemoPanel';
        panel.style.cssText = `
            position: fixed;
            top: 80px;
            right: 10px;
            background: #f8f9fa;
            border: 2px solid #ff6b8b;
            border-radius: 10px;
            padding: 15px;
            z-index: 10000;
            max-width: 300px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            font-family: Arial, sans-serif;
        `;
        
        const report = this.getFilterReport();
        panel.innerHTML = `
            <h3 style="color: #ff6b8b; margin: 0 0 10px 0; font-size: 1.1em;">🧹 Filtro de Palabras</h3>
            <div style="font-size: 0.8em;">
                <p><strong>Palabras bloqueadas:</strong> ${report.badWordsList.length}</p>
                <p><strong>Detecciones:</strong> <span id="detectionCount">${report.totalDetections}</span></p>
                <button onclick="wordFilter.showDetailedReport()" 
                        style="background: #ff6b8b; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer; font-size: 0.8em; margin: 2px;">
                    Ver Reporte
                </button>
                <button onclick="wordFilter.testDemo()" 
                        style="background: #845ec2; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer; font-size: 0.8em; margin: 2px;">
                    Probar Demo
                </button>
            </div>
        `;
        
        document.body.appendChild(panel);
    }

    // Reporte detallado para la demostración
    showDetailedReport() {
        const report = this.getFilterReport();
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border: 3px solid #ff6b8b;
            border-radius: 15px;
            padding: 20px;
            z-index: 10001;
            max-width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            font-family: Arial, sans-serif;
        `;
        
        modal.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h2 style="color: #ff6b8b; margin: 0; font-size: 1.5em;">📊 Reporte del Filtro</h2>
                <button onclick="this.parentElement.parentElement.remove()" 
                        style="background: none; border: none; font-size: 20px; cursor: pointer; color: #666;">×</button>
            </div>
            
            <div style="margin-bottom: 15px;">
                <h3 style="color: #333; margin-bottom: 10px;">📝 Palabras Bloqueadas (${report.badWordsList.length})</h3>
                <div style="display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 15px; max-height: 150px; overflow-y: auto;">
                    ${report.badWordsList.map(word => `
                        <span style="background: #ff6b8b; color: white; padding: 2px 8px; border-radius: 10px; font-size: 0.8em;">
                            ${word}
                        </span>
                    `).join('')}
                </div>
            </div>
            
            <div>
                <h3 style="color: #333; margin-bottom: 10px;">🚫 Detecciones (${report.totalDetections})</h3>
                ${report.detections.length > 0 ? `
                    <div style="max-height: 300px; overflow-y: auto;">
                        ${report.detections.map(detection => `
                            <div style="border-left: 3px solid #ff6b8b; padding: 8px; margin: 5px 0; background: #f8f9fa;">
                                <strong>Palabra:</strong> "${detection.word}"<br>
                                <strong>Texto original:</strong> "${detection.originalText}"<br>
                                <small style="color: #666;">${new Date(detection.timestamp).toLocaleTimeString()}</small>
                            </div>
                        `).join('')}
                    </div>
                ` : '<p style="color: #666; text-align: center;">No hay detecciones registradas</p>'}
            </div>
            
            <div style="margin-top: 15px; text-align: center;">
                <button onclick="wordFilter.testDemo()" 
                        style="background: #845ec2; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer; margin: 5px;">
                    Probar Demo
                </button>
                <button onclick="this.parentElement.parentElement.remove()" 
                        style="background: #6c757d; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer; margin: 5px;">
                    Cerrar
                </button>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    // Demo automática para pruebas
    testDemo() {
        const testCases = [
            {
                text: "Este salón es tonto y horrible",
                shouldBlock: true
            },
            {
                text: "La atención fue estúpida", 
                shouldBlock: true
            },
            {
                text: "Excelente servicio, muy recomendado",
                shouldBlock: false
            },
            {
                text: "Me encantó la decoración y la atención",
                shouldBlock: false
            }
        ];
        
        let completed = 0;
        
        testCases.forEach((test, index) => {
            setTimeout(() => {
                const hasBadWords = this.isProfane(test.text);
                
                if (hasBadWords) {
                    notifier.show('Mensaje inapropiado detectado. Por favor usa un lenguaje respetuoso.', 'error', 4000);
                } else {
                    notifier.show('Comentario aprobado. ¡Gracias por tu opinión!', 'success', 4000);
                }
                
                completed++;
                if (completed === testCases.length) {
                    setTimeout(() => {
                        notifier.show('Demo completada. El filtro está funcionando correctamente.', 'info', 5000);
                    }, 1000);
                }
            }, index * 2000);
        });
        
        notifier.show('Iniciando demostración del filtro de comentarios...', 'info', 3000);
    }
}

// Instanciar el filtro
const wordFilter = new WordFilter();

// Función principal para ver comentarios
function openComments(salonId) {
    console.log('Abriendo comentarios para:', salonId);
    
    const salones = appDatabase.getAllSalones();
    const salon = salones.find(s => s.id === salonId);
    if (!salon) return;
    
    const modal = document.getElementById('commentsModal');
    const modalContent = document.getElementById('modalContent');
    if (!modal || !modalContent) return;
    
    // Actualizar usernames usados
    updateUsedUsernames();
    
    const rating = calculateAverageRating(salon);
    const reviewCount = salon.comments ? salon.comments.length : 0;
    
    modalContent.innerHTML = createCommentsHTML(salon, rating, reviewCount, salonId);
    modal.style.display = 'block';
    
    // Configurar el botón de enviar
    setupSubmitButton(salonId);
}

// Actualizar lista de usernames usados
function updateUsedUsernames() {
    usedUsernames.clear();
    const salones = appDatabase.getAllSalones();
    salones.forEach(salon => {
        if (salon.comments) {
            salon.comments.forEach(comment => {
                usedUsernames.add(comment.username.toLowerCase());
            });
        }
    });
}

// Crear HTML del modal de comentarios
function createCommentsHTML(salon, rating, reviewCount, salonId) {
    return `
        <div style="position: relative;">
            <button onclick="closeCommentsModal()" style="position: absolute; right: 15px; top: 15px; background: white; border: none; font-size: 24px; cursor: pointer; width: 40px; height: 40px; border-radius: 50%; z-index: 100;">
                ×
            </button>
            
            <div style="padding: 20px; background: linear-gradient(135deg, #ff6b8b, #845ec2); color: white; border-radius: 15px 15px 0 0;">
                <h2 style="margin: 0;">${salon.name}</h2>
                <p style="margin: 5px 0 0;">
                    ⭐ ${rating.toFixed(1)} • 💬 ${reviewCount} reseñas
                </p>
            </div>
        </div>
        
        <div style="padding: 20px; max-height: 60vh; overflow-y: auto;">
            <!-- Comentarios existentes -->
            <div style="margin-bottom: 20px;">
                <h3 style="color: #ff6b8b;">💬 Comentarios</h3>
                ${createCommentsList(salon.comments || [])}
            </div>
            
            <!-- Formulario nuevo comentario -->
            <div style="background: #f8f9fa; padding: 20px; border-radius: 10px;">
                <h3 style="color: #845ec2; margin-bottom: 15px;">✏️ Agregar Comentario</h3>
                
                <div style="margin-bottom: 15px;">
                    <input type="text" id="newUsername" 
                           placeholder="Tu nombre *" 
                           style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
                </div>
                
                <div style="margin-bottom: 15px;">
                    <textarea id="newComment" 
                              placeholder="Tu comentario *" 
                              style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; height: 80px;"></textarea>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <p style="margin-bottom: 8px; font-weight: bold;">Calificación *</p>
                    <div style="display: flex; gap: 5px;">
                        ${[1,2,3,4,5].map(stars => `
                            <button type="button" 
                                    class="star-btn" 
                                    data-rating="${stars}"
                                    onclick="selectRating(${stars})"
                                    style="font-size: 24px; background: none; border: none; cursor: pointer; color: #ddd;">
                                ★
                            </button>
                        `).join('')}
                    </div>
                </div>
                
                <button type="button" id="submitCommentBtn" 
                        style="width: 100%; padding: 12px; background: #ff6b8b; color: white; border: none; border-radius: 5px; font-weight: bold; cursor: pointer;">
                    📤 Enviar Comentario
                </button>
            </div>
        </div>
    `;
}

// Crear lista de comentarios
function createCommentsList(comments) {
    if (comments.length === 0) {
        return '<p style="text-align: center; color: #666; padding: 20px;">No hay comentarios aún</p>';
    }
    
    return comments.map(comment => `
        <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 10px; border-left: 4px solid #ff6b8b;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <strong style="color: #ff6b8b;">${comment.username}</strong>
                <span style="color: #ffc107;">${'★'.repeat(comment.rating)}${'☆'.repeat(5-comment.rating)}</span>
            </div>
            <p style="margin: 0; color: #555;">${comment.text}</p>
            <small style="color: #999;">${formatCommentDate(comment.date)}</small>
        </div>
    `).join('');
}

// Configurar botón de enviar
function setupSubmitButton(salonId) {
    const submitBtn = document.getElementById('submitCommentBtn');
    if (submitBtn) {
        submitBtn.onclick = function() {
            submitNewComment(salonId);
        };
    }
}

// Seleccionar rating
function selectRating(rating) {
    // Reset all stars
    document.querySelectorAll('.star-btn').forEach(btn => {
        btn.style.color = '#ddd';
    });
    
    // Color selected stars
    for (let i = 1; i <= rating; i++) {
        const star = document.querySelector(`.star-btn[data-rating="${i}"]`);
        if (star) {
            star.style.color = '#ffc107';
        }
    }
    
    // Store selected rating
    window.currentRating = rating;
}

// Enviar nuevo comentario - ACTUALIZADA CON FILTRO MEJORADO
function submitNewComment(salonId) {
    const username = document.getElementById('newUsername').value.trim();
    const commentText = document.getElementById('newComment').value.trim();
    const rating = window.currentRating || 0;
    
    // Validaciones básicas
    if (!username) {
        notifier.show('Por favor ingresa tu nombre', 'warning', 4000);
        return;
    }
    
    if (!commentText) {
        notifier.show('Por favor escribe tu comentario', 'warning', 4000);
        return;
    }
    
    if (!rating) {
        notifier.show('Por favor selecciona una calificación', 'warning', 4000);
        return;
    }
    
    // Verificar nombre único
    if (usedUsernames.has(username.toLowerCase())) {
        notifier.show('Este nombre ya está en uso. Por favor elige otro.', 'error', 5000);
        return;
    }
    
    // ✅ VERIFICAR PALABRAS PROHIBIDAS CON MENSAJE MEJORADO
    const profaneComment = wordFilter.isProfane(commentText);
    const profaneUsername = wordFilter.isProfane(username);
    
    if (profaneComment || profaneUsername) {
        let message = '';
        
        if (profaneComment && profaneUsername) {
            message = 'El nombre de usuario y el comentario contienen lenguaje inapropiado. Por favor usa un lenguaje respetuoso.';
        } else if (profaneComment) {
            message = 'Tu comentario contiene lenguaje inapropiado. Por favor expresa tu opinión de manera respetuosa.';
        } else if (profaneUsername) {
            message = 'El nombre de usuario contiene lenguaje inapropiado. Por favor elige un nombre respetuoso.';
        }
        
        // Mostrar notificación con mensaje mejorado
        notifier.show(message, 'error', 6000);
        
        // Efecto visual de advertencia
        if (profaneComment) {
            const commentField = document.getElementById('newComment');
            commentField.style.borderColor = '#ff6b6b';
            commentField.style.animation = 'shake 0.5s ease-in-out';
            setTimeout(() => {
                commentField.style.animation = '';
            }, 500);
        }
        
        if (profaneUsername) {
            const usernameField = document.getElementById('newUsername');
            usernameField.style.borderColor = '#ff6b6b';
            usernameField.style.animation = 'shake 0.5s ease-in-out';
            setTimeout(() => {
                usernameField.style.animation = '';
            }, 500);
        }
        
        return;
    }
    
    // Crear comentario
    const newComment = {
        username: username,
        text: commentText,
        rating: rating,
        date: new Date().toISOString()
    };
    
    // Guardar en base de datos
    try {
        const success = appDatabase.addComment(salonId, newComment);
        if (success) {
            // Éxito
            notifier.show('¡Comentario publicado exitosamente! Gracias por tu opinión.', 'success', 4000);
            usedUsernames.add(username.toLowerCase());
            closeCommentsModal();
            
            // Recargar salones para mostrar el nuevo comentario
            if (typeof loadSalones === 'function') {
                setTimeout(() => loadSalones(), 500);
            }
        } else {
            notifier.show('Error al guardar el comentario', 'error', 5000);
        }
    } catch (error) {
        notifier.show('Error: ' + error.message, 'error', 5000);
    }
}

// Cerrar modal
function closeCommentsModal() {
    const modal = document.getElementById('commentsModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Formatear fecha del comentario
function formatCommentDate(dateString) {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (e) {
        return 'Fecha desconocida';
    }
}

// Calcular rating promedio
function calculateAverageRating(salon) {
    if (!salon.comments || salon.comments.length === 0) return 0;
    const sum = salon.comments.reduce((total, comment) => total + comment.rating, 0);
    return sum / salon.comments.length;
}


// Hacer funciones globales
window.openComments = openComments;
window.closeCommentsModal = closeCommentsModal;
window.selectRating = selectRating;
window.submitNewComment = submitNewComment;
window.wordFilter = wordFilter;