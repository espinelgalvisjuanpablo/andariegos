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
  {id:"sim",category:"Entradas",name:"SIMIJACA",description:"Papa chorreada",ingredients:"Papa y preparación de la casa",price:8500},
  {id:"taq",category:"Entradas",name:"TÁQUIRA",description:"Tortilla de queso",ingredients:"Queso y tortilla",price:14500},
  {id:"sal",category:"Entradas",name:"SALITRE",description:"Deditos de queso",ingredients:"Queso y masa artesanal",price:13500},
  {id:"rafa",category:"Entradas",name:"SAN RAFAEL",description:"Queso asado",ingredients:"Queso",price:11500},
  {id:"pinos",category:"Entradas",name:"LOS PINOS",description:"Pastel de yuca",ingredients:"Yuca y relleno de la casa",price:3500},
  {id:"lope",category:"Entradas",name:"DON LOPE",description:"Arepitas de quinoa",ingredients:"Quinoa y maíz",price:10500},
  {id:"churnica",category:"Entradas",name:"CHURNICA",description:"Tabla de patacón rayado",ingredients:"Patacón y acompañamientos de la casa",price:17000},

  {id:"cris",category:"Pizzas",name:"CRISTALES",description:"Pizza napolitana",ingredients:"Masa, tomate y queso",price:19000},
  {id:"junc",category:"Pizzas",name:"JUNCAL",description:"Pizza de champiñones",ingredients:"Champiñones, masa y queso",price:19000},
  {id:"fical",category:"Pizzas",name:"FICAL",description:"Pizza de piña dulce",ingredients:"Piña, masa y queso",price:19000},
  {id:"esp",category:"Pizzas",name:"ESPERANZA",description:"Pizza mexicana",ingredients:"Vegetales, sabores mexicanos y queso",price:19000},
  {id:"moy",category:"Pizzas",name:"MOYBA",description:"Pizza de orellanas",ingredients:"Orellanas, masa y queso",price:19000},
  {id:"apo",category:"Pizzas",name:"APOSENTOS",description:"Pizza de vegetales asados",ingredients:"Vegetales asados, masa y queso",price:19000},
  {id:"ceb",category:"Pizzas",name:"PIZZA DE CEBOLLA",description:"Pizza de cebolla caramelizada",ingredients:"Cebolla, masa y queso",price:19000},

  {id:"sc",category:"Hamburguesas",name:"SAN CAYETANO",description:"Hamburguesa de frijol",ingredients:"Frijol, pan y vegetales",price:20000},
  {id:"sb",category:"Hamburguesas",name:"SANTA BÁRBARA",description:"Hamburguesa de lentejas",ingredients:"Lentejas, pan y vegetales",price:20000},
  {id:"lc",category:"Hamburguesas",name:"LAS CHATAS",description:"Mini hamburguesitas",ingredients:"Preparación vegetal y pan",price:13500},

  {id:"pb",category:"Arepas",name:"PEÑA BLANCA",description:"Arepa de acompañado",ingredients:"Arepa y acompañamientos de la casa",price:13500},
  {id:"ret",category:"Mazorcada",name:"EL RETÉN",description:"Omelette relleno de mazorcada",ingredients:"Huevo, maíz y vegetales",price:13500},

  {id:"susa",category:"Cocina del Mundo",name:"SUSA",description:"Ramen",ingredients:"Fideos, vegetales y caldo",price:24000},
  {id:"chi",category:"Cocina del Mundo",name:"CHIQUINQUIRÁ",description:"Lasagna",ingredients:"Pasta, salsa, vegetales y queso",price:25000},
  {id:"uba",category:"Cocina del Mundo",name:"UBATÉ",description:"Carne de hongos",ingredients:"Hongos y salsa de la casa",price:24000},
  {id:"raq",category:"Cocina del Mundo",name:"RÁQUIRA",description:"Arroz frito",ingredients:"Arroz y vegetales",price:24000},
  {id:"pv",category:"Cocina del Mundo",name:"PUEBLO VIEJO",description:"Milanesa de berenjena a la parmesana",ingredients:"Berenjena, tomate y parmesano",price:24000},
  {id:"and",category:"Cocina del Mundo",name:"ANDAREGO",description:"Sandwich",ingredients:"Pan, vegetales y preparación de la casa",price:19000},
  {id:"vr",category:"Cocina del Mundo",name:"VILLA REAL",description:"Fettuccini caseros",ingredients:"Pasta fresca y salsa de la casa",price:23500},

  {id:"alto",category:"Postres de autor",name:"ALTO AMARILLO",description:"Crème brûlée",ingredients:"Crema, vainilla y azúcar",price:9000,image:"/images/postre-01.jpg"},
  {id:"pied",category:"Postres de autor",name:"PIEDRA COLADA",description:"Panqueque de arequipe",ingredients:"Panqueque y arequipe",price:12500},
  {id:"par",category:"Postres de autor",name:"PARAÍSO",description:"Helado casero",ingredients:"Preparación casera",price:9500},
  {id:"cue",category:"Postres de autor",name:"CUEVA NEGRA",description:"Volcán de chocolate",ingredients:"Chocolate y preparación de la casa",price:12000},

  {id:"sic",category:"Jugos",name:"SICUARA",description:"Manzana + pepino + jengibre",ingredients:"Manzana, pepino y jengibre",price:4500},
  {id:"tuy",category:"Jugos",name:"TUYA",description:"Mango + pepino + jengibre",ingredients:"Mango, pepino y jengibre",price:4500},
  {id:"run",category:"Jugos",name:"RUNGA",description:"Mora + hierbabuena",ingredients:"Mora y hierbabuena",price:4500},
  {id:"luc",category:"Jugos",name:"SANTA LUCÍA",description:"Naranja + zanahoria + jengibre",ingredients:"Naranja, zanahoria y jengibre",price:4500},
  {id:"mar",category:"Jugos",name:"LA MARÍA",description:"Piña + hierbabuena o pepino + jengibre",ingredients:"Piña, hierbabuena, pepino y jengibre",price:4500},
  {id:"marg",category:"Jugos",name:"LAS MARGARITAS",description:"Limonada + hierbabuena + jengibre",ingredients:"Limón, hierbabuena y jengibre",price:4500},

  {id:"gin",category:"Cócteles",name:"GIN TONIC",description:"Gin tonic",ingredients:"Preparación de la casa",price:13000},
  {id:"agu",category:"Cócteles",name:"AGUARDIENTE TONIC",description:"Aguardiente tonic",ingredients:"Preparación de la casa",price:13000},
  {id:"cai",category:"Cócteles",name:"CAIPIROSKA",description:"Caipiroska",ingredients:"Preparación de la casa",price:13000},
  {id:"des",category:"Cócteles",name:"DESTORNILLADOR",description:"Destornillador",ingredients:"Preparación de la casa",price:13000},
  {id:"pinacol",category:"Cócteles",name:"PIÑA COLADA",description:"Piña colada",ingredients:"Preparación de la casa",price:13000},

  {id:"aguila",category:"Cerveza",name:"ÁGUILA",description:"Cerveza",ingredients:"Cerveza",price:3800},
  {id:"club",category:"Cerveza",name:"CLUB COLOMBIA",description:"Cerveza",ingredients:"Cerveza",price:4500}
];

export const formatCOP = (value:number) =>
  new Intl.NumberFormat("es-CO",{style:"currency",currency:"COP",maximumFractionDigits:0}).format(value);
