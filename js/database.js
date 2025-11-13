// Sistema de base de datos con LocalStorage
class Database {
    constructor() {
        this.storageKey = 'salonesInfantilesData';
        console.log('🔄 Inicializando Database...');
        this.init();
    }

    // Inicializar con datos de ejemplo si no existen
    init() {
        console.log('📦 Verificando datos existentes...');
        const existingData = localStorage.getItem(this.storageKey);
        
        if (!existingData) {
            console.log('🚀 No hay datos, creando datos de ejemplo...');
            const sampleData = this.getSampleData();
            this.saveData(sampleData);
            console.log('✅ Datos de ejemplo creados:', sampleData.length, 'salones');
        } else {
            console.log('✅ Datos existentes encontrados');
            try {
                const data = JSON.parse(existingData);
                console.log('📊 Salones en storage:', data.length);
            } catch (error) {
                console.error('❌ Error parseando datos existentes, reinicializando...');
                const sampleData = this.getSampleData();
                this.saveData(sampleData);
            }
        }
    }

    // Obtener datos de ejemplo
    getSampleData() {
        console.log('🎨 Generando datos de ejemplo...');
        return [
            {
                id: 1,
                name: 'Salon Infantil JOELITO',
                description: 'Un lugar mágico lleno de diversión con toboganes gigantes y piscinas de pelotas. Perfecto para cumpleaños infantiles.',
                image: 'images/salones/salon1.jpg',
                gallery: [
                    'images/gallery/salon1-1.jpg',
                ],
                lat: -16.4875,
                lng: -68.1723,
                comments: [
                    {
                        username: 'María López',
                        text: '¡Mi hijo amó su fiesta aquí! Los toboganes son increíbles.',
                        rating: 5,
                        date: '2024-01-15T10:30:00Z'
                    },
                    {
                        username: 'Carlos Ruiz',
                        text: 'Muy buen servicio y atención. Volveremos pronto.',
                        rating: 4,
                        date: '2024-01-20T14:20:00Z'
                    }
                ]
            },
            {
                id: 2,
                name: 'Salon Infantil Pequeño Gigante',
                description: 'Parque temático de animales con actividades educativas y recreativas. Los niños amarán interactuar con nuestros animalitos.',
                image: 'images/salones/salon2.jpg',
                gallery: [
                    'images/gallery/salon2-1.jpg',
                ],
                lat: -16.494,
                lng: -68.176,
                comments: [
                    {
                        username: 'Ana Martínez',
                        text: 'Los animales están bien cuidados y los niños aprenden mucho.',
                        rating: 5,
                        date: '2024-01-18T11:15:00Z'
                    }
                ]
            },
            {
                id: 3,
                name: 'Fabiola Fiesta',
                description: 'El salón más colorido de la ciudad con decoraciones temáticas personalizadas y shows de magia incluidos.',
                image: 'https://images.unsplash.com/photo-1532117182044-031e7cd916ee?w=400&h=300&fit=crop',
                gallery: [
                    'https://images.unsplash.com/photo-1532117182044-031e7cd916ee?w=400&h=300&fit=crop',
                    'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=300&fit=crop',
                    'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&h=300&fit=crop'
                ],
                lat: -16.495,
                lng: -68.143,
                comments: []
            },
            {
                id: 4,
                name: 'Salon Infantil Angelito',
                description: 'Un mundo de fantasía donde los sueños se hacen realidad. Castillos inflables y personajes de cuentos.',
                image: 'images/salones/salon4.jpg',
                gallery: [
                    'images/gallery/salon4-1.jpg',
                    ],
                lat: -16.525,
                lng: -68.173,
                comments: [
                    {
                        username: 'Pedro Sánchez',
                        text: 'La decoración es espectacular. Mi hija se sintió como princesa.',
                        rating: 5,
                        date: '2024-01-22T16:45:00Z'
                    }
                ]
            },
            {
                id: 5,
                name: 'Arca de Noé',
                description: 'Aventura bíblica con juegos acuáticos y animales mecánicos. Diversión garantizada para todas las edades.',
                image: 'https://images.unsplash.com/photo-1533237264986-2c30e61c56d7?w=400&h=300&fit=crop',
                gallery: [
                    'https://images.unsplash.com/photo-1533237264986-2c30e61c56d7?w=400&h=300&fit=crop',
                    'https://images.unsplash.com/photo-1511882150382-421056c89033?w=400&h=300&fit=crop',
                    'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=300&fit=crop'
                ],
                lat: -16.535,
                lng: -68.183,
                comments: []
            },
            {
                id: 6,
                name: 'Eventopia',
                description: 'El lugar perfecto para eventos especiales. Espacios amplios y servicios completos para fiestas inolvidables.',
                image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=300&fit=crop',
                gallery: [
                    'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=300&fit=crop',
                    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=300&fit=crop'
                ],
                lat: -16.485,
                lng: -68.133,
                comments: [
                    {
                        username: 'Laura García',
                        text: 'Excelente para fiestas grandes. El espacio es amplio y cómodo.',
                        rating: 4,
                        date: '2024-01-25T12:30:00Z'
                    }
                ]
            }
        ];
    }

    // Obtener todos los salones - VERSIÓN CORREGIDA SIN RECURSIÓN
    getAllSalones() {
        try {
            const data = localStorage.getItem(this.storageKey);
            if (!data) {
                console.warn('⚠️ No hay datos en LocalStorage');
                return []; // Retornar array vacío en lugar de llamar recursivamente
            }
            
            const salones = JSON.parse(data);
            if (!Array.isArray(salones)) {
                console.error('❌ Los datos no son un array válido');
                return [];
            }
            
            return salones;
        } catch (error) {
            console.error('❌ Error al obtener salones:', error);
            return [];
        }
    }

    // Guardar todos los salones
    saveData(salones) {
        try {
            if (!Array.isArray(salones)) {
                throw new Error('Los datos a guardar deben ser un array');
            }
            
            localStorage.setItem(this.storageKey, JSON.stringify(salones));
            console.log('💾 Datos guardados:', salones.length, 'salones');
            return true;
        } catch (error) {
            console.error('❌ Error al guardar datos:', error);
            return false;
        }
    }

    // Obtener el próximo ID disponible
    getNextId(salones) {
        if (!Array.isArray(salones) || salones.length === 0) return 1;
        
        const ids = salones.map(s => s.id).filter(id => typeof id === 'number');
        if (ids.length === 0) return 1;
        
        return Math.max(...ids) + 1;
    }

    // Agregar un nuevo salón
    addSalon(salonData) {
        const salones = this.getAllSalones();
        const newSalon = {
            ...salonData,
            id: this.getNextId(salones),
            comments: salonData.comments || []
        };
        salones.push(newSalon);
        this.saveData(salones);
        console.log('➕ Salón agregado:', newSalon.name);
        return newSalon;
    }

    // Actualizar un salón
    updateSalon(salonId, salonData) {
        const salones = this.getAllSalones();
        const index = salones.findIndex(s => s.id === salonId);
        
        if (index !== -1) {
            // Mantener los comentarios existentes
            const existingComments = salones[index].comments || [];
            salones[index] = {
                ...salonData,
                id: salonId,
                comments: existingComments
            };
            this.saveData(salones);
            console.log('✏️ Salón actualizado:', salonData.name);
            return true;
        }
        console.warn('⚠️ Salón no encontrado para actualizar:', salonId);
        return false;
    }

    // Eliminar un salón
    deleteSalon(salonId) {
        const salones = this.getAllSalones();
        const filteredSalones = salones.filter(s => s.id !== salonId);
        this.saveData(filteredSalones);
        console.log('🗑️ Salón eliminado:', salonId);
        return true;
    }

    // Agregar comentario a un salón
    addComment(salonId, comment) {
        const salones = this.getAllSalones();
        const salonIndex = salones.findIndex(s => s.id === salonId);
        
        if (salonIndex !== -1) {
            if (!salones[salonIndex].comments) {
                salones[salonIndex].comments = [];
            }
            salones[salonIndex].comments.push(comment);
            this.saveData(salones);
            console.log('💬 Comentario agregado a:', salones[salonIndex].name);
            return true;
        }
        console.warn('⚠️ Salón no encontrado para comentario:', salonId);
        return false;
    }

    // Eliminar comentario
    deleteComment(salonId, username) {
        const salones = this.getAllSalones();
        const salonIndex = salones.findIndex(s => s.id === salonId);
        
        if (salonIndex !== -1 && salones[salonIndex].comments) {
            const initialLength = salones[salonIndex].comments.length;
            salones[salonIndex].comments = salones[salonIndex].comments.filter(c => c.username !== username);
            
            if (salones[salonIndex].comments.length < initialLength) {
                this.saveData(salones);
                console.log('🗑️ Comentario eliminado de:', salones[salonIndex].name);
                return true;
            }
        }
        console.warn('⚠️ Comentario no encontrado para eliminar');
        return false;
    }

    // Restablecer datos de ejemplo
    resetToSampleData() {
        const sampleData = this.getSampleData();
        this.saveData(sampleData);
        console.log('🔄 Datos restablecidos a valores de ejemplo');
        return sampleData;
    }

    // Exportar datos
    exportData() {
        const data = this.getAllSalones();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'salones-data.json';
        a.click();
        URL.revokeObjectURL(url);
        console.log('📤 Datos exportados');
    }

    // Importar datos
    importData(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    if (Array.isArray(data)) {
                        this.saveData(data);
                        console.log('📥 Datos importados:', data.length, 'salones');
                        resolve(data);
                    } else {
                        reject(new Error('Formato de archivo inválido - debe ser un array'));
                    }
                } catch (error) {
                    reject(new Error('Error al parsear JSON: ' + error.message));
                }
            };
            reader.onerror = () => reject(new Error('Error al leer el archivo'));
            reader.readAsText(file);
        });
    }
}

// Crear instancia global de la base de datos
console.log('🚀 Creando instancia de Database...');
const appDatabase = new Database();
console.log('✅ Database inicializado correctamente');