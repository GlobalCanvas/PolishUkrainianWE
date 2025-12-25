// ==UserScript==
// @name         Pu puwe Bot
// @version      1.0.0
// @author       Darkness Remaked by Puwe
// @description  Bot for pixunivers.fun
// @connect      pixunivers.fun
// @match        *://*.pixunivers.fun/*
// ==/UserScript==

// ========================================
// ИЗМЕНЕНИЕ 1: Создайте класс API для pixunivers.fun
// Вставьте этот код перед функцией En (около строки 2200-2300)
// ========================================

const PixuniversAPI = class extends nn {
    constructor(){
        super(...arguments);
        // Используйте базовый протокол или адаптируйте под pixunivers
        this.packets = xe;
    }
    
    getWsUrl(){
        // WebSocket URL для pixunivers.fun
        return location.origin.replace("http","ws")+"/ws";
    }
    
    getChunkUrl(coords){
        // URL для загрузки чанков
        return `${location.origin}/chunks/${this.canvasId}/${coords[0]}/${coords[1]}.bmp`;
    }
    
    static async fetchSiteCanvases(){
        // Получение списка канвасов
        let response = await fetch(location.origin+"/api/canvases");
        let {canvases} = await response.json();
        return {canvases};
    }
    
    static async build(canvasId){
        let canvasesData = await this.getMe();
        let instance = new this({canvasId});
        instance.info = ke(canvasesData.canvases[canvasId]);
        await instance.ws.connect();
        return instance;
    }
    
    static async getMe(){
        if(!this.me) {
            this.me = await this.fetchSiteCanvases();
        }
        return this.me;
    }
    
    static async getCanvasIdByCanvasIdent(ident){
        let canvasesData = await this.getMe();
        for(let[id, canvas] of Object.entries(canvasesData.canvases)) {
            if(canvas.ident === ident) return +id;
        }
        throw new Error(`No canvas found for ident: ${ident}`);
    }
}

// ========================================
// ИЗМЕНЕНИЕ 2: Модифицируйте функцию En
// Найдите функцию En (около строки 2300-2400) и замените на:
// ========================================

En = async () => {
    // ТОЛЬКО для pixunivers.fun
    if(/.*:\/\/.*pixunivers\.fun.*/.test(location.origin)){
        let hashMatch = location.hash.match(/#[a-z]/g);
        let canvasChar = hashMatch ? hashMatch[0][1] : "d";
        let canvasId = await PixuniversAPI.getCanvasIdByCanvasIdent(canvasChar);
        
        console.log("🎨 Pixunivers.fun detected, canvas:", canvasChar);
        
        return Promise.all([
            PixuniversAPI.build(canvasId),
            sn() // canvas state API
        ]);
    }
    
    // Если не pixunivers.fun - выбросить ошибку
    throw new Error("This bot works only on pixunivers.fun");
}

// ========================================
// ИЗМЕНЕНИЕ 3: Опциональные настройки протокола
// Если pixunivers использует другой протокол, раскомментируйте:
// ========================================

/*
// Если нужен специальный класс пакетов:
const PixuniversPackets = class extends xe {
    // Переопределите методы если нужно
    static serializePixelUpdate(i, j, pixels){
        // Ваша реализация
        return super.serializePixelUpdate(i, j, pixels);
    }
}

// И используйте в PixuniversAPI:
// this.packets = PixuniversPackets;
*/

// ========================================
// ИНСТРУКЦИЯ ПО ПРИМЕНЕНИЮ:
// ========================================
/*
1. Скопируйте изменения выше в ваш оригинальный файл
2. Найдите функцию En в оригинале (используйте Ctrl+F "En=async")
3. Замените её на версию из ИЗМЕНЕНИЕ 2
4. Вставьте класс PixuniversAPI перед функцией En
5. Обновите @match и @connect в начале файла
6. Сохраните и перезагрузите страницу на pixunivers.fun

ВАЖНО:
- Протестируйте на devtools (F12), проверьте консоль на ошибки
- Если WebSocket не подключается - проверьте getWsUrl()
- Если не загружаются чанки - проверьте getChunkUrl()
- Возможно потребуется адаптировать протокол пакетов
*/
