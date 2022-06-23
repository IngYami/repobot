const TeleBot = require('telebot');

let axios = require ('axios')

const API = 'https://fakestoreapi.com/products';

const BUTTONS = {
    back: {
        label: 'Regresar',
        command: '/back'
    },
    listItem: {
        label: '🍍 Articulos',
        command: '/listItem'
    },
    checkStock: {
        label: '🔎 Detalles',
        command: '/checkStock'
    },
    checkTransaction: {
        label: '🛒 Add to Carrito',
        command: '/checkTransaction'
    },
    paymentMethod: {
        label: '💰 Metodos de pago',
        command: '/paymentMethod'
    },
    deliveryZone: {
        label: '🕘Horario y Zonas Delivery 📍',
        command: '/deliveryZone'
    }

};


const myBot = new TeleBot({
    token: '5581606501:AAH2KS9gj2BBG0GlkZT0spfJc607ckvd9j0',
    usePlugins: ['askUser','namedButtons'],
    pluginConfig: {
        namedButtons: {
            buttons: BUTTONS
        }
    }
});

function checkResponse(msg){
    let text = msg.text;
    let dataResponse = {
        'hi' : 'Hola'+msg.from.username+',\n Soy tu asistente de Pineapple Store 🍍!\n selecciona una opcion del menú',
        'hello' : 'Hola'+msg.from.username+',\n Soy tu asistente de Pineapple Store 🍍!\n selecciona una opcion del menú',
    }
    text = text.replace(' ','_').toLowerCase();
    return (dataResponse[text]) ? dataResponse[text] : false;
}

myBot.on(['/start', 'hello'], msg => {
    let replyMarkup = myBot.keyboard([
        [BUTTONS.listItem.label, BUTTONS.paymentMethod.label ] ,
        [BUTTONS.deliveryZone.label, '/start']
    ], {resize: true});
    let username = msg.from.username;
    return myBot.sendMessage(msg.from.id, 'Hola,'+username+' \n *Bienvenido a PINEAPPLE STORE* 🍍 \n ', {replyMarkup}).then(res => {
        myBot.sendMessage(msg.from.id, 'puedes ver nuestra lista de productos presionando "🍍Articulos"')
    });
});

myBot.on(['/deliveryZone'], msg => {
    
    let message = '🍍<b> HORARIO PINEAPPLE STORE🍍</b>:\n'
        message += '🕘DE LUNES A SABADO DE 8AM A 5PM\n\n';
        message += '🍍<b>ENCOMIENDAS Y DELIVERY 🛵</b>:\n'
        message += 'Las encomiendas salen los dias Jueves a todo el país 🇻🇪 \n' + 'Delivery todos los dias solo zona centro previo acuerdo';
       
        return myBot.sendMessage(msg.from.id, message, {parseMode : 'html'});
    
    });


myBot.on(['/paymentMethod'], msg => {
    
    let message = '🍍<b> METODOS DE PAGO</b>:\n'
        message += '1)Efectivo 💵\n' + '2)Transferencia 🏦\n' + '3)Cryptos (BTC,ETH,USDT) 📲₿\n';
           
        return myBot.sendMessage(msg.from.id, message, {parseMode : 'html'});
        
     });

myBot.on(['/hide'], msg => {
    return myBot.sendMessage(msg.from.id, 'escribe HELLO para mostrar el menu', {replyMarkup: 'hide'});
});

myBot.on(['/back'], msg => {
  let  replyMarkup = myBot.keyboard([
    [BUTTONS.listItem.label, BUTTONS.paymentMethod.label ] ,
    [BUTTONS.deliveryZone.label, '/start']
], {resize: true})
return myBot.sendMessage(msg.from.id,'Menu principal, seleccione una opcion de nuestro Menú para continuar', {replyMarkup});
});

myBot.on(['/listItem'], function (msg) {
    async function getProductData() {
        try {
          const response = await axios.get(API);
          let articulo = response.data;
          let resultado = ``;
          let len = articulo.length;
          let i=0;
          for (;i<len;i++){
            resultado += `${articulo[i].id})  ${articulo[i].title.substring(0,30)}\n Precio: 💲${articulo[i].price}\n\n`;
            }
            return myBot.sendMessage(msg.chat.id,` ${resultado}`);  
         } catch (error) {
          console.log(error);
        }
      }getProductData()
      let replyMarkup = myBot.keyboard([
        [BUTTONS.checkStock.label, BUTTONS.checkTransaction.label],
        ['/start', BUTTONS.back.label]
    ], {resize: true});
  
      return myBot.sendMessage(msg.from.id, '🍍Nuestros productos disponibles: ', {replyMarkup});
});



myBot.on(['/checkStock'], msg => {
    return myBot.sendMessage(msg.from.id, 'Por favor ingrese el ID del producto a consultar🔎', {ask: 'product'});
});

myBot.on('ask.product', msg => {

    const i = msg.from.id;

    async function getProductDet() {
        try {
    let idx= msg.text;
    const response = await axios.get(`https://fakestoreapi.com/products/${idx}`);
    let product = response.data;      
    let message = '🍍<b> Resultado de la busqueda </b>:\n\n'
        
        message += '<b> 💠Nombre</b>: '+product.title+'\n\n';
        message += '<b> 💲Precio </b>: $'+product.price+'\n\n';
        message += '<b> 🔰Categoria</b>: '+product.category+'\n\n';
        message += '<b> 📢Descripción</b> :'+product.description.substring(0,100) +'\n\n';
        message += '<b> 📸imagen</b>: '+product.image+'\n\n';
       
        return myBot.sendMessage(i, message, {parseMode : 'html'});
     
} catch (error) {
 console.log(error);
}
}getProductDet()

});


myBot.start();
