import { Product, Category, Order, Customer, InventoryMovement, StoreConfig, WebsiteLayoutConfig, UserAccount, DemoArchetype } from '../types';

export interface PresetData {
  config: StoreConfig;
  layout: WebsiteLayoutConfig;
  categories: Category[];
  products: Product[];
  orders: Order[];
  customers: Customer[];
  inventoryMovements: InventoryMovement[];
}

export const DEMO_PRESETS: Record<DemoArchetype, PresetData> = {
  bistro: {
    config: {
      name: 'Bistró & Fuego',
      slug: 'bistro-fuego',
      tagline: 'Cocina a las brasas y coctelería contemporánea',
      description: 'Menú digital artesanal con ingredientes orgánicos y cortes premium cocinados con leña de encino.',
      logo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=200&q=80',
      primaryColor: '#0F172A',
      accentColor: '#6366F1',
      fontStyle: 'modern',
      heroImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
      bannerText: '🔥 Reserva para este fin de semana y obtén un cóctel de bienvenida cortesía de la casa.',
      bannerActive: true,
      welcomeText: 'Bienvenido a nuestra experiencia gastronómica',
      phone: '+52 55 4912 8830',
      whatsapp: '+52 55 4912 8830',
      email: 'reservas@bistrofuego.com',
      address: 'Av. Masaryk 410, Polanco, Ciudad de México',
      googleMapsUrl: 'https://maps.google.com/?q=Polanco+CDMX',
      currency: 'MXN',
      currencySymbol: '$',
      taxRate: 16,
      socials: {
        instagram: 'https://instagram.com/bistrofuego',
        facebook: 'https://facebook.com/bistrofuego',
        tiktok: 'https://tiktok.com/@bistrofuego'
      },
      openingHours: {
        lunes: { open: '13:00', close: '23:00', isOpen: true },
        martes: { open: '13:00', close: '23:00', isOpen: true },
        miercoles: { open: '13:00', close: '23:00', isOpen: true },
        jueves: { open: '13:00', close: '00:00', isOpen: true },
        viernes: { open: '13:00', close: '01:00', isOpen: true },
        sabado: { open: '13:00', close: '01:00', isOpen: true },
        domingo: { open: '12:00', close: '20:00', isOpen: true }
      },
      whatsappOrderMessage: 'Hola Bistró & Fuego, me gustaría confirmar el siguiente pedido/reserva de su menú digital:',
      policies: {
        shipping: 'Envíos a domicilio en un radio de 5 km empaquetados en contenedores térmicos biodegradables.',
        returns: 'Garantía de satisfacción: cualquier inconveniente con su platillo será reemplazado de inmediato.',
        terms: 'Precios en MXN con IVA incluido. Propinas voluntarias conforme a la normativa vigente.'
      },
      faqs: [
        { question: '¿Cuentan con opciones vegetarianas o veganas?', answer: 'Sí, contamos con sección especial de vegetales a la parrilla, ensaladas y postres libres de lácteos.' },
        { question: '¿Hacen entregas a domicilio?', answer: 'Sí, despachamos pedidos para llevar y entrega local con confirmación inmediata por WhatsApp.' },
        { question: '¿Cómo puedo reservar para un grupo grande?', answer: 'Contáctanos directamente a nuestro botón de WhatsApp para eventos corporativos o aniversarios.' }
      ]
    },
    layout: {
      heroStyle: 'showcase',
      showBanner: true,
      showFeaturedCategories: true,
      showFeaturedProducts: true,
      showAbout: true,
      showReviews: true,
      showFaq: true,
      sectionOrder: ['banner', 'hero', 'categories', 'featured', 'about', 'reviews', 'faq'],
      heroHeadline: 'Sabor Auténtico, Alta Cocina a la Leña',
      heroSubheadline: 'Explora nuestra carta digital interactiva, pide a tu mesa o agenda tu pedido para llevar con total facilidad.',
      ctaText: 'Ver Menú Digital',
      footerNote: 'Bistró & Fuego © Todos los derechos reservados. Desarrollado con tecnología Webora.'
    },
    categories: [
      { id: 'cat-1', name: 'Entradas & Tapas', slug: 'entradas', description: 'Bocados de inicio ideales para compartir', order: 1, isPublished: true, image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&w=400&q=80' },
      { id: 'cat-2', name: 'Platos Fuertes & Cortes', slug: 'platos-fuertes', description: 'Cortes Sterling Silver y piezas al carbón', order: 2, isPublished: true, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80' },
      { id: 'cat-3', name: 'Pastas & Pizzas de Autor', slug: 'pastas-pizzas', description: 'Masa madre fermentada 48 horas al horno de piedra', order: 3, isPublished: true, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80' },
      { id: 'cat-4', name: 'Coctelería & Vinos', slug: 'cocteleria', description: 'Mixología botánica y vinos seleccionados', order: 4, isPublished: true, image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=400&q=80' },
      { id: 'cat-5', name: 'Postres Artesanales', slug: 'postres', description: 'Elaboración diaria con chocolate de origen', order: 5, isPublished: true, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=400&q=80' }
    ],
    products: [
      {
        id: 'prod-1',
        name: 'Ribeye Prime a las Brasas (400g)',
        slug: 'ribeye-prime-brasas',
        description: 'Corte madurado con sal ahumada de Colima, puré rústico de papa trufada y espárragos grillados.',
        price: 680,
        comparePrice: 750,
        cost: 290,
        sku: 'COR-001',
        categoryId: 'cat-2',
        images: ['https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=800&q=80'],
        stock: 18,
        minStockAlert: 5,
        isPublished: true,
        isFeatured: true,
        variants: [
          {
            id: 'var-1',
            name: 'Término de cocción',
            options: [
              { id: 'opt-1', name: 'Término Medio (Recomendado)', priceDelta: 0, stock: 10 },
              { id: 'opt-2', name: 'Tres Cuartos', priceDelta: 0, stock: 5 },
              { id: 'opt-3', name: 'Bien Cocido', priceDelta: 0, stock: 3 }
            ]
          }
        ],
        tags: ['Destacado', 'Cortes', 'Chef Pick'],
        createdAt: '2026-03-01T10:00:00Z',
        updatedAt: '2026-03-10T15:30:00Z'
      },
      {
        id: 'prod-2',
        name: 'Pizza Trufata con Hongos Silvestres',
        slug: 'pizza-trufata-hongos',
        description: 'Masa madre de 48h, fior di latte, crema de trufa negra de verano, portobellos asados y albahaca fresca.',
        price: 360,
        comparePrice: 390,
        cost: 110,
        sku: 'PIZ-002',
        categoryId: 'cat-3',
        images: ['https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80'],
        stock: 35,
        minStockAlert: 10,
        isPublished: true,
        isFeatured: true,
        variants: [
          {
            id: 'var-2',
            name: 'Tamaño',
            options: [
              { id: 'opt-4', name: 'Individual (28 cm)', priceDelta: 0, stock: 20 },
              { id: 'opt-5', name: 'Familiar (36 cm)', priceDelta: 110, stock: 15 }
            ]
          }
        ],
        tags: ['Masa Madre', 'Vegetariano'],
        createdAt: '2026-03-02T11:00:00Z',
        updatedAt: '2026-03-11T12:00:00Z'
      },
      {
        id: 'prod-3',
        name: 'Carpaccio de Salmón Ahumado en Casa',
        slug: 'carpaccio-salmon',
        description: 'Finas láminas de salmón noruego, alcaparras crujientes, vinagreta de limón amarillo, brotes de cilantro y focaccia recién horneada.',
        price: 290,
        cost: 95,
        sku: 'ENT-003',
        categoryId: 'cat-1',
        images: ['https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80'],
        stock: 14,
        minStockAlert: 4,
        isPublished: true,
        isFeatured: false,
        variants: [],
        tags: ['Entrada', 'Fresco'],
        createdAt: '2026-03-03T14:00:00Z',
        updatedAt: '2026-03-10T18:00:00Z'
      },
      {
        id: 'prod-4',
        name: 'Cóctel Fuego Ahumado (Mezcal & Romero)',
        slug: 'coctel-fuego-ahumado',
        description: 'Mezcal espadín artesanal de Oaxaca, jugo de toronja fresca, jarabe de agave infusionado y rama de romero encendida en mesa.',
        price: 210,
        cost: 55,
        sku: 'MIX-004',
        categoryId: 'cat-4',
        images: ['https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80'],
        stock: 50,
        minStockAlert: 15,
        isPublished: true,
        isFeatured: true,
        variants: [],
        tags: ['Mixología', 'Autor'],
        createdAt: '2026-03-04T16:00:00Z',
        updatedAt: '2026-03-09T20:00:00Z'
      },
      {
        id: 'prod-5',
        name: 'Fondant de Chocolate Oaxaqueño 70%',
        slug: 'fondant-chocolate-oaxaca',
        description: 'Corazón líquido tibio de cacao criollo, helado artesanal de vainilla de Papantla y crumble de avellanas tostadas.',
        price: 195,
        cost: 60,
        sku: 'POS-005',
        categoryId: 'cat-5',
        images: ['https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80'],
        stock: 4, // Low stock demo!
        minStockAlert: 6,
        isPublished: true,
        isFeatured: true,
        variants: [],
        tags: ['Postre', 'Favorito'],
        createdAt: '2026-03-05T12:00:00Z',
        updatedAt: '2026-03-11T19:00:00Z'
      },
      {
        id: 'prod-6',
        name: 'Risotto con Langostinos y Azafrán',
        slug: 'risotto-langostinos-azafran',
        description: 'Arroz Carnaroli mantecado con queso Parmigiano Reggiano 24 meses, hebras de azafrán español y langostinos salteados en mantequilla blanca.',
        price: 490,
        cost: 180,
        sku: 'PAS-006',
        categoryId: 'cat-3',
        images: ['https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80'],
        stock: 0, // Out of stock demo!
        minStockAlert: 5,
        isPublished: true,
        isFeatured: false,
        variants: [],
        tags: ['Especial', 'Mar'],
        createdAt: '2026-03-06T13:00:00Z',
        updatedAt: '2026-03-11T21:00:00Z'
      }
    ],
    orders: [
      {
        id: 'ord-101',
        orderNumber: 'BF-2041',
        customer: {
          name: 'Mariana Valenzuela',
          phone: '+52 55 9812 3456',
          email: 'mariana.val@gmail.com',
          address: 'Campos Elíseos 120, Apto 4B, Polanco',
          notes: 'Por favor entregar cubiertos ecológicos y salsa picante aparte.'
        },
        items: [
          { productId: 'prod-1', productName: 'Ribeye Prime a las Brasas (400g)', price: 680, quantity: 1 },
          { productId: 'prod-4', productName: 'Cóctel Fuego Ahumado', price: 210, quantity: 2 },
          { productId: 'prod-5', productName: 'Fondant de Chocolate Oaxaqueño', price: 195, quantity: 1 }
        ],
        subtotal: 1295,
        deliveryFee: 50,
        total: 1345,
        paymentMethod: 'Transferencia SPEI',
        paymentStatus: 'Pagado',
        status: 'En preparación',
        createdAt: '2026-03-12T13:20:00Z',
        updatedAt: '2026-03-12T13:30:00Z',
        timeline: [
          { status: 'Nuevo', timestamp: '2026-03-12T13:20:00Z', note: 'Pedido recibido desde el menú digital Webora' },
          { status: 'Confirmado', timestamp: '2026-03-12T13:22:00Z', note: 'Comprobante SPEI validado con éxito' },
          { status: 'En preparación', timestamp: '2026-03-12T13:25:00Z', note: 'Comanda enviada a parrilla central' }
        ]
      },
      {
        id: 'ord-102',
        orderNumber: 'BF-2040',
        customer: {
          name: 'Carlos Mendoza',
          phone: '+52 55 3344 5566',
          email: 'cmendoza@empresa.com',
          address: 'Paseo de la Reforma 222, Piso 14',
          notes: 'Mesa 6 salón principal (Pedido en mesa).'
        },
        items: [
          { productId: 'prod-2', productName: 'Pizza Trufata con Hongos Silvestres', price: 470, quantity: 2 },
          { productId: 'prod-3', productName: 'Carpaccio de Salmón Ahumado', price: 290, quantity: 1 }
        ],
        subtotal: 1230,
        deliveryFee: 0,
        total: 1230,
        paymentMethod: 'Tarjeta',
        paymentStatus: 'Pagado',
        status: 'Listo para entregar',
        createdAt: '2026-03-12T12:45:00Z',
        updatedAt: '2026-03-12T13:15:00Z',
        timeline: [
          { status: 'Nuevo', timestamp: '2026-03-12T12:45:00Z' },
          { status: 'Confirmado', timestamp: '2026-03-12T12:48:00Z' },
          { status: 'Listo para entregar', timestamp: '2026-03-12T13:15:00Z', note: 'Listo en barra de salida' }
        ]
      },
      {
        id: 'ord-103',
        orderNumber: 'BF-2039',
        customer: {
          name: 'Valeria Sotomayor',
          phone: '+52 55 7711 2233',
          email: 'valeria.soto@hotmail.com',
          address: 'Arquímedes 88, Polanco',
          notes: 'Llamar al timbre 301 al llegar.'
        },
        items: [
          { productId: 'prod-2', productName: 'Pizza Trufata con Hongos Silvestres', price: 360, quantity: 1 },
          { productId: 'prod-4', productName: 'Cóctel Fuego Ahumado', price: 210, quantity: 1 }
        ],
        subtotal: 570,
        deliveryFee: 45,
        total: 615,
        paymentMethod: 'Efectivo',
        paymentStatus: 'Pendiente',
        status: 'Pendiente de confirmación',
        createdAt: '2026-03-12T13:40:00Z',
        updatedAt: '2026-03-12T13:40:00Z',
        timeline: [
          { status: 'Nuevo', timestamp: '2026-03-12T13:40:00Z' },
          { status: 'Pendiente de confirmación', timestamp: '2026-03-12T13:40:00Z', note: 'Esperando confirmación telefónica / WhatsApp' }
        ]
      },
      {
        id: 'ord-104',
        orderNumber: 'BF-2038',
        customer: {
          name: 'Rodrigo Alarcón',
          phone: '+52 55 1234 9988',
          email: 'ralarcon@gmail.com',
          address: 'Homero 1420, Depto 101',
          notes: 'Entregado con éxito a las 12:10'
        },
        items: [
          { productId: 'prod-1', productName: 'Ribeye Prime a las Brasas', price: 680, quantity: 2 },
          { productId: 'prod-5', productName: 'Fondant de Chocolate', price: 195, quantity: 2 }
        ],
        subtotal: 1750,
        deliveryFee: 50,
        total: 1800,
        paymentMethod: 'Tarjeta',
        paymentStatus: 'Pagado',
        status: 'Entregado',
        createdAt: '2026-03-12T11:10:00Z',
        updatedAt: '2026-03-12T12:10:00Z',
        timeline: [
          { status: 'Nuevo', timestamp: '2026-03-12T11:10:00Z' },
          { status: 'Confirmado', timestamp: '2026-03-12T11:15:00Z' },
          { status: 'En preparación', timestamp: '2026-03-12T11:20:00Z' },
          { status: 'Enviado', timestamp: '2026-03-12T11:45:00Z' },
          { status: 'Entregado', timestamp: '2026-03-12T12:10:00Z', note: 'Entregado y cobrado en terminal' }
        ]
      }
    ],
    customers: [
      {
        id: 'cust-1',
        name: 'Mariana Valenzuela',
        phone: '+52 55 9812 3456',
        email: 'mariana.val@gmail.com',
        address: 'Campos Elíseos 120, Apto 4B, Polanco',
        totalOrders: 6,
        totalSpent: 7850,
        firstOrderDate: '2026-01-14',
        lastOrderDate: '2026-03-12',
        notes: 'Cliente frecuente VIP. Prefiere vinos tintos de cuerpo medio.'
      },
      {
        id: 'cust-2',
        name: 'Carlos Mendoza',
        phone: '+52 55 3344 5566',
        email: 'cmendoza@empresa.com',
        address: 'Paseo de la Reforma 222, Piso 14',
        totalOrders: 3,
        totalSpent: 3690,
        firstOrderDate: '2026-02-02',
        lastOrderDate: '2026-03-12',
        notes: 'Almuerzos ejecutivos de empresa.'
      },
      {
        id: 'cust-3',
        name: 'Valeria Sotomayor',
        phone: '+52 55 7711 2233',
        email: 'valeria.soto@hotmail.com',
        address: 'Arquímedes 88, Polanco',
        totalOrders: 2,
        totalSpent: 1230,
        firstOrderDate: '2026-02-18',
        lastOrderDate: '2026-03-12'
      },
      {
        id: 'cust-4',
        name: 'Rodrigo Alarcón',
        phone: '+52 55 1234 9988',
        email: 'ralarcon@gmail.com',
        address: 'Homero 1420, Depto 101',
        totalOrders: 8,
        totalSpent: 14200,
        firstOrderDate: '2025-11-20',
        lastOrderDate: '2026-03-12',
        notes: 'Suele pedir cortes grandes para cenas familiares.'
      }
    ],
    inventoryMovements: [
      {
        id: 'mov-1',
        productId: 'prod-1',
        productName: 'Ribeye Prime a las Brasas (400g)',
        type: 'IN',
        quantity: 20,
        previousStock: 0,
        newStock: 20,
        reason: 'Recepción de pedido carne madurada proveedor Sonora Beef',
        date: '2026-03-10 09:30',
        user: 'Admin Webora'
      },
      {
        id: 'mov-2',
        productId: 'prod-1',
        productName: 'Ribeye Prime a las Brasas (400g)',
        type: 'SALE',
        quantity: -2,
        previousStock: 20,
        newStock: 18,
        reason: 'Deducción automática por venta confirmada #BF-2038',
        date: '2026-03-12 11:15',
        user: 'Sistema Automático'
      },
      {
        id: 'mov-3',
        productId: 'prod-5',
        productName: 'Fondant de Chocolate Oaxaqueño 70%',
        type: 'SALE',
        quantity: -2,
        previousStock: 6,
        newStock: 4,
        reason: 'Deducción automática por venta confirmada #BF-2038',
        date: '2026-03-12 11:15',
        user: 'Sistema Automático'
      },
      {
        id: 'mov-4',
        productId: 'prod-6',
        productName: 'Risotto con Langostinos y Azafrán',
        type: 'ADJUST',
        quantity: -3,
        previousStock: 3,
        newStock: 0,
        reason: 'Agotado en cocina por fin de stock de azafrán español',
        date: '2026-03-11 21:00',
        user: 'Chef Ejecutivo'
      }
    ]
  },

  fashion: {
    config: {
      name: 'Aura Concept Store',
      slug: 'aura-concept',
      tagline: 'Moda minimalista y sastrería contemporánea',
      description: 'Prendas con cortes limpios elaboradas éticamente en lino natural, algodón orgánico y seda.',
      logo: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=200&q=80',
      primaryColor: '#18181B',
      accentColor: '#4F46E5',
      fontStyle: 'editorial',
      heroImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80',
      bannerText: '✨ Colección Primavera 2026 disponible con envío gratuito a partir de $1,200',
      bannerActive: true,
      welcomeText: 'Diseño consciente para tu día a día',
      phone: '+52 55 8820 1199',
      whatsapp: '+52 55 8820 1199',
      email: 'hola@auraconcept.mx',
      address: 'Colima 256, Col. Roma Norte, CDMX',
      googleMapsUrl: 'https://maps.google.com/?q=Roma+Norte+CDMX',
      currency: 'MXN',
      currencySymbol: '$',
      taxRate: 16,
      socials: {
        instagram: 'https://instagram.com/auraconcept',
        facebook: 'https://facebook.com/auraconcept',
        tiktok: 'https://tiktok.com/@auraconcept'
      },
      openingHours: {
        lunes: { open: '11:00', close: '20:00', isOpen: true },
        martes: { open: '11:00', close: '20:00', isOpen: true },
        miercoles: { open: '11:00', close: '20:00', isOpen: true },
        jueves: { open: '11:00', close: '20:00', isOpen: true },
        viernes: { open: '11:00', close: '20:30', isOpen: true },
        sabado: { open: '11:00', close: '20:30', isOpen: true },
        domingo: { open: '12:00', close: '18:00', isOpen: true }
      },
      whatsappOrderMessage: 'Hola Aura Concept, quiero ordenar las siguientes prendas desde el catálogo:',
      policies: {
        shipping: 'Envíos nacionales en 24 a 48 horas mediante paquetería express rastreada.',
        returns: 'Cambios de talla y devoluciones sin costo dentro de los 30 días posteriores a la compra.',
        terms: 'Prendas con certificación de comercio justo.'
      },
      faqs: [
        { question: '¿Cómo elijo mi talla?', answer: 'Cada producto cuenta con guía de medidas en centímetros para busto, cintura y cadera.' },
        { question: '¿Tienen tienda física?', answer: 'Sí, visítanos en Colima 256, Roma Norte con probadores privados y asesoría personalizada.' }
      ]
    },
    layout: {
      heroStyle: 'split',
      showBanner: true,
      showFeaturedCategories: true,
      showFeaturedProducts: true,
      showAbout: true,
      showReviews: true,
      showFaq: true,
      sectionOrder: ['banner', 'hero', 'categories', 'featured', 'about', 'reviews', 'faq'],
      heroHeadline: 'Elegancia Sin Esfuerzo en Cada Línea',
      heroSubheadline: 'Explora prendas atemporales diseñadas para perdurar, con materiales nobles y acabados de sastrería.',
      ctaText: 'Ver Catálogo Completo',
      footerNote: 'Aura Concept Store © 2026. Catálogo digital impulsado por Webora.'
    },
    categories: [
      { id: 'cat-f1', name: 'Vestidos & Monos', slug: 'vestidos', description: 'Siluetas fluidas y relajadas', order: 1, isPublished: true, image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=400&q=80' },
      { id: 'cat-f2', name: 'Camisas & Lino', slug: 'camisas', description: 'Tejidos 100% lino transpirable', order: 2, isPublished: true, image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=400&q=80' },
      { id: 'cat-f3', name: 'Pantalones & Bermudas', slug: 'pantalones', description: 'Cortes rectos y tiro alto', order: 3, isPublished: true, image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=400&q=80' },
      { id: 'cat-f4', name: 'Bolsos & Calzado', slug: 'accesorios', description: 'Cuero curtido vegetal y accesorios', order: 4, isPublished: true, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=400&q=80' }
    ],
    products: [
      {
        id: 'prod-f1',
        name: 'Vestido Midi en Lino Crudo',
        slug: 'vestido-midi-lino-crudo',
        description: 'Confeccionado en lino belga prelavado con escote en V suave y bolsillos laterales invisibles.',
        price: 1850,
        comparePrice: 2100,
        cost: 650,
        sku: 'AUR-VES-01',
        categoryId: 'cat-f1',
        images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80'],
        stock: 22,
        minStockAlert: 5,
        isPublished: true,
        isFeatured: true,
        variants: [
          {
            id: 'vf-1',
            name: 'Talla',
            options: [
              { id: 'opt-f1', name: 'S', priceDelta: 0, stock: 6 },
              { id: 'opt-f2', name: 'M', priceDelta: 0, stock: 10 },
              { id: 'opt-f3', name: 'L', priceDelta: 0, stock: 6 }
            ]
          }
        ],
        tags: ['Best Seller', 'Lino'],
        createdAt: '2026-03-01T10:00:00Z',
        updatedAt: '2026-03-10T12:00:00Z'
      },
      {
        id: 'prod-f2',
        name: 'Camisa Oversize de Rayas en Algodón Pima',
        slug: 'camisa-oversize-algodon-pima',
        description: 'Patrón holgado moderno con cuello clásico, botones de nácar natural y puños anchos.',
        price: 1420,
        cost: 490,
        sku: 'AUR-CAM-02',
        categoryId: 'cat-f2',
        images: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80'],
        stock: 15,
        minStockAlert: 4,
        isPublished: true,
        isFeatured: true,
        variants: [
          {
            id: 'vf-2',
            name: 'Color',
            options: [
              { id: 'opt-fc1', name: 'Azul Cielo / Blanco', priceDelta: 0, stock: 8 },
              { id: 'opt-fc2', name: 'Oliva Suave', priceDelta: 0, stock: 7 }
            ]
          }
        ],
        tags: ['Algodón Pima', 'Unisex'],
        createdAt: '2026-03-02T11:00:00Z',
        updatedAt: '2026-03-10T15:00:00Z'
      },
      {
        id: 'prod-f3',
        name: 'Tote Bag de Cuero Vachetta Caramel',
        slug: 'tote-bag-cuero-caramel',
        description: 'Bolso amplio de piel con pátina natural de uso, forro de loneta de algodón y bolsillo interno con cremallera.',
        price: 2490,
        comparePrice: 2800,
        cost: 920,
        sku: 'AUR-ACC-03',
        categoryId: 'cat-f4',
        images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80'],
        stock: 5,
        minStockAlert: 3,
        isPublished: true,
        isFeatured: true,
        variants: [],
        tags: ['Artesanal', 'Cuero'],
        createdAt: '2026-03-03T10:00:00Z',
        updatedAt: '2026-03-09T18:00:00Z'
      }
    ],
    orders: [
      {
        id: 'ord-f1',
        orderNumber: 'AUR-8012',
        customer: {
          name: 'Sofía Navarro',
          phone: '+52 55 6677 8899',
          email: 'sofia.navarro@gmail.com',
          address: 'Guanajuato 118, Roma Norte',
          notes: 'Favor de envolver para regalo si es posible.'
        },
        items: [
          { productId: 'prod-f1', productName: 'Vestido Midi en Lino Crudo', price: 1850, quantity: 1 },
          { productId: 'prod-f3', productName: 'Tote Bag de Cuero Vachetta', price: 2490, quantity: 1 }
        ],
        subtotal: 4340,
        deliveryFee: 0,
        total: 4340,
        paymentMethod: 'Tarjeta',
        paymentStatus: 'Pagado',
        status: 'En preparación',
        createdAt: '2026-03-12T10:15:00Z',
        updatedAt: '2026-03-12T10:45:00Z',
        timeline: [
          { status: 'Nuevo', timestamp: '2026-03-12T10:15:00Z' },
          { status: 'Confirmado', timestamp: '2026-03-12T10:20:00Z' },
          { status: 'En preparación', timestamp: '2026-03-12T10:45:00Z', note: 'Empacando en caja ecológica' }
        ]
      }
    ],
    customers: [
      {
        id: 'cust-f1',
        name: 'Sofía Navarro',
        phone: '+52 55 6677 8899',
        email: 'sofia.navarro@gmail.com',
        address: 'Guanajuato 118, Roma Norte',
        totalOrders: 3,
        totalSpent: 9120,
        firstOrderDate: '2026-01-10',
        lastOrderDate: '2026-03-12'
      }
    ],
    inventoryMovements: [
      {
        id: 'mov-f1',
        productId: 'prod-f1',
        productName: 'Vestido Midi en Lino Crudo',
        type: 'IN',
        quantity: 25,
        previousStock: 0,
        newStock: 25,
        reason: 'Lote inicial confección taller artesanal',
        date: '2026-03-01 10:00',
        user: 'Admin Webora'
      }
    ]
  },

  cafe: {
    config: {
      name: 'Miga & Café Especialidad',
      slug: 'miga-cafe',
      tagline: 'Café de finca tostado en casa & panadería de masa madre',
      description: 'Granos de especialidad de Chiapas, Veracruz y Oaxaca con extracciones de autor y pan recién horneado cada mañana.',
      logo: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=200&q=80',
      primaryColor: '#27272A',
      accentColor: '#D97706',
      fontStyle: 'modern',
      heroImage: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80',
      bannerText: '🥐 Pan recién horneado todos los días a partir de las 7:30 AM',
      bannerActive: true,
      welcomeText: 'El aroma de una buena mañana',
      phone: '+52 55 4120 7733',
      whatsapp: '+52 55 4120 7733',
      email: 'contacto@migaycafe.mx',
      address: 'Ámsterdam 140, Col. Condesa, CDMX',
      googleMapsUrl: 'https://maps.google.com/?q=Condesa+CDMX',
      currency: 'MXN',
      currencySymbol: '$',
      taxRate: 16,
      socials: {
        instagram: 'https://instagram.com/migaycafe',
        facebook: 'https://facebook.com/migaycafe'
      },
      openingHours: {
        lunes: { open: '07:30', close: '21:00', isOpen: true },
        martes: { open: '07:30', close: '21:00', isOpen: true },
        miercoles: { open: '07:30', close: '21:00', isOpen: true },
        jueves: { open: '07:30', close: '21:00', isOpen: true },
        viernes: { open: '07:30', close: '22:00', isOpen: true },
        sabado: { open: '08:00', close: '22:00', isOpen: true },
        domingo: { open: '08:00', close: '20:00', isOpen: true }
      },
      whatsappOrderMessage: 'Hola Miga & Café, quiero pedir lo siguiente de su menú para recoger / entrega:',
      policies: {
        shipping: 'Envíos en bicicleta en colonia Condesa y Roma en menos de 35 minutos.',
        returns: 'Bebidas preparadas al momento con cambio si la temperatura no es adecuada.',
        terms: 'Cafés con trazabilidad de origen y comercio directo.'
      },
      faqs: [
        { question: '¿Tienen leches vegetales?', answer: 'Sí, contamos con avena barista, almendra casera y soya sin costo adicional.' },
        { question: '¿Venden café en grano?', answer: 'Sí, molemos al momento según tu método: espresso, Chemex, V60 o prensa francesa.' }
      ]
    },
    layout: {
      heroStyle: 'showcase',
      showBanner: true,
      showFeaturedCategories: true,
      showFeaturedProducts: true,
      showAbout: true,
      showReviews: true,
      showFaq: true,
      sectionOrder: ['banner', 'hero', 'categories', 'featured', 'about', 'reviews', 'faq'],
      heroHeadline: 'Tu Ritual de Café, Elevado',
      heroSubheadline: 'Ordena desde tu mesa o para llevar. Grano tostado artesanalmente y panadería de fermentación lenta.',
      ctaText: 'Ver Menú de Cafetería',
      footerNote: 'Miga & Café © 2026. Sistema administrativo Webora.'
    },
    categories: [
      { id: 'cat-c1', name: 'Cafetería de Especialidad', slug: 'cafe', description: 'Espresso bar y filtrados manuales', order: 1, isPublished: true, image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80' },
      { id: 'cat-c2', name: 'Panadería de Masa Madre', slug: 'panaderia', description: 'Croissants, hogazas y rol de canela', order: 2, isPublished: true, image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=400&q=80' },
      { id: 'cat-c3', name: 'Brunch & Tostas', slug: 'brunch', description: 'Opciones saladas y bowls nutritivos', order: 3, isPublished: true, image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=400&q=80' }
    ],
    products: [
      {
        id: 'prod-c1',
        name: 'Flat White Doble con Leña de Avena',
        slug: 'flat-white-avena',
        description: 'Doble shot de espresso chiapaneco notas de caramelo con leche de avena emulsionada sedosa.',
        price: 78,
        cost: 22,
        sku: 'CAF-001',
        categoryId: 'cat-c1',
        images: ['https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80'],
        stock: 99,
        minStockAlert: 15,
        isPublished: true,
        isFeatured: true,
        variants: [],
        tags: ['Favorito', 'Vegano'],
        createdAt: '2026-03-01T08:00:00Z',
        updatedAt: '2026-03-12T08:00:00Z'
      },
      {
        id: 'prod-c2',
        name: 'Croissant Tradicional de Mantequilla Francesa',
        slug: 'croissant-mantequilla',
        description: 'Hojaldre crujiente dorado de 27 capas elaborado con mantequilla Elle & Vire AOP.',
        price: 65,
        cost: 24,
        sku: 'PAN-002',
        categoryId: 'cat-c2',
        images: ['https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80'],
        stock: 12,
        minStockAlert: 5,
        isPublished: true,
        isFeatured: true,
        variants: [],
        tags: ['Horneado Diario'],
        createdAt: '2026-03-01T08:00:00Z',
        updatedAt: '2026-03-12T09:00:00Z'
      }
    ],
    orders: [
      {
        id: 'ord-c1',
        orderNumber: 'MIG-501',
        customer: {
          name: 'Andrea Morales',
          phone: '+52 55 2211 4455',
          email: 'andrea.morales@gmail.com',
          address: 'Ámsterdam 90, Depto 2',
          notes: 'Mesa 4 en terraza exterior.'
        },
        items: [
          { productId: 'prod-c1', productName: 'Flat White Doble con Leña de Avena', price: 78, quantity: 2 },
          { productId: 'prod-c2', productName: 'Croissant Tradicional', price: 65, quantity: 2 }
        ],
        subtotal: 286,
        deliveryFee: 0,
        total: 286,
        paymentMethod: 'WhatsApp Pay',
        paymentStatus: 'Pagado',
        status: 'Entregado',
        createdAt: '2026-03-12T09:10:00Z',
        updatedAt: '2026-03-12T09:25:00Z',
        timeline: [
          { status: 'Nuevo', timestamp: '2026-03-12T09:10:00Z' },
          { status: 'Confirmado', timestamp: '2026-03-12T09:12:00Z' },
          { status: 'Entregado', timestamp: '2026-03-12T09:25:00Z' }
        ]
      }
    ],
    customers: [
      {
        id: 'cust-c1',
        name: 'Andrea Morales',
        phone: '+52 55 2211 4455',
        email: 'andrea.morales@gmail.com',
        address: 'Ámsterdam 90, Depto 2',
        totalOrders: 14,
        totalSpent: 3950,
        firstOrderDate: '2026-01-05',
        lastOrderDate: '2026-03-12'
      }
    ],
    inventoryMovements: []
  },

  barber: {
    config: {
      name: 'The Royal Club Barber & Grooming',
      slug: 'royal-club',
      tagline: 'Cortes clásicos, afeitado a navaja y cuidado para caballeros',
      description: 'Experiencia premium de barbería tradicional con toalla caliente, sillones Belmont y productos de cuidado de barba de alta gama.',
      logo: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=200&q=80',
      primaryColor: '#18181B',
      accentColor: '#3B82F6',
      fontStyle: 'bold',
      heroImage: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1200&q=80',
      bannerText: '💈 Agenda tu cita con toalla caliente y bebida de cortesía',
      bannerActive: true,
      welcomeText: 'Estilo y maestría en cada detalle',
      phone: '+52 55 5588 9900',
      whatsapp: '+52 55 5588 9900',
      email: 'citas@theroyalclub.mx',
      address: 'Prado Norte 340, Lomas de Chapultepec, CDMX',
      googleMapsUrl: 'https://maps.google.com/?q=Lomas+CDMX',
      currency: 'MXN',
      currencySymbol: '$',
      taxRate: 16,
      socials: {
        instagram: 'https://instagram.com/royalclubbarber',
        facebook: 'https://facebook.com/royalclubbarber'
      },
      openingHours: {
        lunes: { open: '10:00', close: '20:00', isOpen: true },
        martes: { open: '10:00', close: '20:00', isOpen: true },
        miercoles: { open: '10:00', close: '20:00', isOpen: true },
        jueves: { open: '10:00', close: '20:00', isOpen: true },
        viernes: { open: '10:00', close: '21:00', isOpen: true },
        sabado: { open: '09:00', close: '20:00', isOpen: true },
        domingo: { open: '10:00', close: '16:00', isOpen: true }
      },
      whatsappOrderMessage: 'Hola The Royal Club, deseo solicitar la siguiente cita / servicio:',
      policies: {
        shipping: 'Productos de cuidado con envío nacional inmediato.',
        returns: 'Garantía en pomadas y aceites no abiertos en 15 días.',
        terms: 'Tolerancia de 10 minutos en citas presenciales.'
      },
      faqs: [
        { question: '¿Se requiere cita previa?', answer: 'Recomendamos agendar en línea, aunque también aceptamos clientes por orden de llegada según disponibilidad.' }
      ]
    },
    layout: {
      heroStyle: 'minimal',
      showBanner: true,
      showFeaturedCategories: true,
      showFeaturedProducts: true,
      showAbout: true,
      showReviews: true,
      showFaq: true,
      sectionOrder: ['banner', 'hero', 'categories', 'featured', 'about', 'reviews', 'faq'],
      heroHeadline: 'El Arte Tradicional del Afeitado y Corte',
      heroSubheadline: 'Servicios de barbería de primer nivel y catálogo de productos para el cuidado de tu barba y cabello.',
      ctaText: 'Ver Servicios y Productos',
      footerNote: 'The Royal Club © 2026. Diseñado y gestionado con Webora.'
    },
    categories: [
      { id: 'cat-b1', name: 'Servicios de Barbería', slug: 'servicios', description: 'Cortes, perfilado y ritual de afeitado', order: 1, isPublished: true, image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=400&q=80' },
      { id: 'cat-b2', name: 'Pomadas & Cuidado Capilar', slug: 'pomadas', description: 'Fijación mate, brillo y arcillas', order: 2, isPublished: true, image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=400&q=80' }
    ],
    products: [
      {
        id: 'prod-b1',
        name: 'Ritual Completo Royal: Corte + Barba con Toalla Caliente',
        slug: 'ritual-royal-corte-barba',
        description: 'Lavado con shampoo de menta, corte a tijera y máquina, perfilado a navaja, vapor ozonizado y bálsamo hidratante.',
        price: 550,
        cost: 120,
        sku: 'SRV-001',
        categoryId: 'cat-b1',
        images: ['https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80'],
        stock: 50,
        minStockAlert: 10,
        isPublished: true,
        isFeatured: true,
        variants: [],
        tags: ['Servicio Estrella'],
        createdAt: '2026-03-01T10:00:00Z',
        updatedAt: '2026-03-10T10:00:00Z'
      },
      {
        id: 'prod-b2',
        name: 'Pomada Matte Clay Fijación Fuerte (100ml)',
        slug: 'pomada-matte-clay',
        description: 'Base agua con arcilla de bentonita, aroma amaderado de cedro y acabado mate natural que no deja residuos.',
        price: 380,
        cost: 140,
        sku: 'PRD-002',
        categoryId: 'cat-b2',
        images: ['https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80'],
        stock: 24,
        minStockAlert: 5,
        isPublished: true,
        isFeatured: true,
        variants: [],
        tags: ['Producto', 'Mate'],
        createdAt: '2026-03-01T10:00:00Z',
        updatedAt: '2026-03-10T10:00:00Z'
      }
    ],
    orders: [],
    customers: [],
    inventoryMovements: []
  }
};

export const INITIAL_USERS: UserAccount[] = [
  {
    id: 'usr-1',
    name: 'Carlos Garza (Propietario)',
    email: 'carlos@webora.app',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    phone: '+52 55 4912 8830',
    active: true,
    createdAt: '2026-01-01'
  },
  {
    id: 'usr-2',
    name: 'Esteban Morales (Cajero / Atención)',
    email: 'esteban@webora.app',
    role: 'employee',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    phone: '+52 55 8899 1122',
    active: true,
    createdAt: '2026-02-15'
  },
  {
    id: 'usr-3',
    name: 'Lucía Méndez (Gerente de Turno)',
    email: 'lucia.mendez@webora.app',
    role: 'employee',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    phone: '+52 55 6677 3344',
    active: true,
    createdAt: '2026-02-20'
  }
];
