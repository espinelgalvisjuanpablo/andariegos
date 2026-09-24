export type Product = {
  id: string;
  category: string;
  name: string;
  description: string;
  ingredients: string;
  price: number;
  image?: string;
  status?: "available" | "soon" | "soldout";
};

export const categories = [
  "Entradas","Pizzas","Hamburguesas","Arepas","Mazorcada",
  "Cocina del Mundo","Postres de autor","Jugos","Cócteles","Cerveza"
] as const;

export const products: Product[] = [
  {id:"sim",category:"Entradas",name:"SIMIJACA",description:"Papa chorreada de la casa, una entrada cálida y tradicional para abrir la mesa.",ingredients:"Papa y preparación de la casa",price:8500},
  {id:"taq",category:"Entradas",name:"TÁQUIRA",description:"Tortilla de queso preparada para compartir un bocado sencillo y reconfortante.",ingredients:"Queso y tortilla",price:14500},
  {id:"sal",category:"Entradas",name:"SALITRE",description:"Deditos de queso con masa artesanal, pensados para picar y compartir.",ingredients:"Queso y masa artesanal",price:13500},
  {id:"rafa",category:"Entradas",name:"SAN RAFAEL",description:"Queso asado",ingredients:"Queso",price:11500},
  {id:"pinos",category:"Entradas",name:"LOS PINOS",description:"Pastel de yuca de la casa, pequeño y perfecto para empezar.",ingredients:"Yuca y relleno de la casa",price:3500},
  {id:"lope",category:"Entradas",name:"DON LOPE",description:"Arepitas de quinoa y maíz, una entrada de formato pequeño para compartir.",ingredients:"Quinoa y maíz",price:10500},
  {id:"churnica",category:"Entradas",name:"CHURNICA",description:"Tabla de patacón rayado con acompañamientos de la casa; disponible personal o para compartir.",ingredients:"Patacón y acompañamientos de la casa",price:17000},

  {id:"cris",category:"Pizzas",name:"CRISTALES",description:"Pizza napolitana de masa, tomate y queso, en una preparación de inspiración italiana.",ingredients:"Masa, tomate y queso",price:19000},
  {id:"junc",category:"Pizzas",name:"JUNCAL",description:"Pizza de champiñones con masa y queso, donde el hongo toma el protagonismo.",ingredients:"Champiñones, masa y queso",price:19000},
  {id:"fical",category:"Pizzas",name:"FICAL",description:"Pizza de piña dulce con masa y queso, un contraste sencillo entre dulce y salado.",ingredients:"Piña, masa y queso",price:19000},
  {id:"esp",category:"Pizzas",name:"ESPERANZA",description:"Pizza mexicana con vegetales, sabores mexicanos y queso.",ingredients:"Vegetales, sabores mexicanos y queso",price:19000},
  {id:"moy",category:"Pizzas",name:"MOYBA",description:"Pizza de orellanas con masa y queso, una opción donde el hongo es protagonista.",ingredients:"Orellanas, masa y queso",price:19000},
  {id:"apo",category:"Pizzas",name:"APOSENTOS",description:"Pizza de vegetales asados con masa y queso, de perfil vegetal y artesanal.",ingredients:"Vegetales asados, masa y queso",price:19000},
  {id:"ceb",category:"Pizzas",name:"PIZZA DE CEBOLLA",description:"Pizza de cebolla caramelizada con masa y queso, marcada por el contraste dulce de la cebolla.",ingredients:"Cebolla, masa y queso",price:19000},

  {id:"sc",category:"Hamburguesas",name:"SAN CAYETANO",description:"Hamburguesa de frijol con pan y vegetales, una interpretación vegetal de un clásico.",ingredients:"Frijol, pan y vegetales",price:20000},
  {id:"sb",category:"Hamburguesas",name:"SANTA BÁRBARA",description:"Hamburguesa de lentejas con pan y vegetales, de base vegetal.",ingredients:"Lentejas, pan y vegetales",price:20000},
  {id:"lc",category:"Hamburguesas",name:"LAS CHATAS",description:"Mini hamburguesitas para compartir o disfrutar en formato pequeño.",ingredients:"Preparación vegetal y pan",price:13500},

  {id:"pb",category:"Arepas",name:"PEÑA BLANCA",description:"Arepa de acompañado con los complementos de la casa.",ingredients:"Arepa y acompañamientos de la casa",price:13500},
  {id:"ret",category:"Mazorcada",name:"EL RETÉN",description:"Omelette relleno de mazorcada, una preparación que lleva el maíz al centro del plato.",ingredients:"Huevo, maíz y vegetales",price:13500},

  {id:"susa",category:"Cocina del Mundo",name:"SUSA",description:"Ramen de la casa con fideos, vegetales y caldo.",ingredients:"Fideos, vegetales y caldo",price:24000},
  {id:"chi",category:"Cocina del Mundo",name:"CHIQUINQUIRÁ",description:"Lasagna con pasta, salsa, vegetales y queso.",ingredients:"Pasta, salsa, vegetales y queso",price:25000},
  {id:"uba",category:"Cocina del Mundo",name:"UBATÉ",description:"Carne de hongos con salsa de la casa, una preparación vegetal de textura y sabor profundo.",ingredients:"Hongos y salsa de la casa",price:24000},
  {id:"raq",category:"Cocina del Mundo",name:"RÁQUIRA",description:"Arroz frito con arroz y vegetales, inspirado en una preparación de cocina del mundo.",ingredients:"Arroz y vegetales",price:24000},
  {id:"pv",category:"Cocina del Mundo",name:"PUEBLO VIEJO",description:"Milanesa de berenjena a la parmesana con berenjena, tomate y parmesano.",ingredients:"Berenjena, tomate y parmesano",price:24000},
  {id:"and",category:"Cocina del Mundo",name:"ANDAREGO",description:"Sandwich de la casa con pan, vegetales y preparación propia.",ingredients:"Pan, vegetales y preparación de la casa",price:19000},
  {id:"vr",category:"Cocina del Mundo",name:"VILLA REAL",description:"Fettuccini caseros con pasta fresca y salsa de la casa.",ingredients:"Pasta fresca y salsa de la casa",price:23500},

  {id:"alto",category:"Postres de autor",name:"ALTO AMARILLO",description:"Crème brûlée de crema, vainilla y azúcar, dentro de la línea de postres de autor.",ingredients:"Crema, vainilla y azúcar",price:9000,image:"/images/postre-01.jpeg"},
  {id:"pied",category:"Postres de autor",name:"PIEDRA COLADA",description:"Panqueque de arequipe, un postre de autor de perfil dulce y casero.",ingredients:"Panqueque y arequipe",price:12500},
  {id:"par",category:"Postres de autor",name:"PARAÍSO",description:"Helado casero preparado en Andariegos.",ingredients:"Preparación casera",price:9500},
  {id:"cue",category:"Postres de autor",name:"CUEVA NEGRA",description:"Volcán de chocolate de centro fundente y preparación de la casa.",ingredients:"Chocolate y preparación de la casa",price:12000},

  {id:"sic",category:"Jugos",name:"SICUARA",description:"Jugo de manzana, pepino y jengibre, fresco y de perfil vegetal.",ingredients:"Manzana, pepino y jengibre",price:4500},
  {id:"tuy",category:"Jugos",name:"TUYA",description:"Jugo de mango, pepino y jengibre, con un contraste entre fruta y notas frescas.",ingredients:"Mango, pepino y jengibre",price:4500},
  {id:"run",category:"Jugos",name:"RUNGA",description:"Jugo de mora y hierbabuena, frutal y aromático.",ingredients:"Mora y hierbabuena",price:4500},
  {id:"luc",category:"Jugos",name:"SANTA LUCÍA",description:"Jugo de naranja, zanahoria y jengibre, cítrico y fresco.",ingredients:"Naranja, zanahoria y jengibre",price:4500},
  {id:"mar",category:"Jugos",name:"LA MARÍA",description:"Preparación a elección: piña con hierbabuena o pepino con jengibre.",ingredients:"Piña, hierbabuena, pepino y jengibre",price:4500},
  {id:"marg",category:"Jugos",name:"LAS MARGARITAS",description:"Limonada con hierbabuena y jengibre, fresca y aromática.",ingredients:"Limón, hierbabuena y jengibre",price:4500},

  {id:"gin",category:"Cócteles",name:"GIN TONIC",description:"Gin tonic preparado al estilo de la casa.",ingredients:"Preparación de la casa",price:13000},
  {id:"agu",category:"Cócteles",name:"AGUARDIENTE TONIC",description:"Aguardiente tonic preparado al estilo de la casa.",ingredients:"Preparación de la casa",price:13000},
  {id:"cai",category:"Cócteles",name:"CAIPIROSKA",description:"Caipiroska preparada al estilo de la casa.",ingredients:"Preparación de la casa",price:13000},
  {id:"des",category:"Cócteles",name:"DESTORNILLADOR",description:"Destornillador preparado al estilo de la casa.",ingredients:"Preparación de la casa",price:13000},
  {id:"pinacol",category:"Cócteles",name:"PIÑA COLADA",description:"Piña colada preparada al estilo de la casa.",ingredients:"Preparación de la casa",price:13000},

  {id:"aguila",category:"Cerveza",name:"ÁGUILA",description:"Cerveza Águila.",ingredients:"Cerveza",price:3800},
  {id:"club",category:"Cerveza",name:"CLUB COLOMBIA",description:"Cerveza Club Colombia.",ingredients:"Cerveza",price:4500}
];

export const formatCOP = (value:number) =>
  new Intl.NumberFormat("es-CO",{style:"currency",currency:"COP",maximumFractionDigits:0}).format(value);
