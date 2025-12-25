// ==UserScript==
// @name         PuBot для pixunivers.fun
// @version      1.0.3
// @author       Darkness Remaked by Puwe
// @description  Bot для pixunivers.fun (упрощенная версия)
// @icon         https://raw.githubusercontent.com/TouchedByDarkness/PixelPlanet-Bot/master/rounded-avatar-128.png
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @grant        unsafeWindow
// @run-at       document-start
// @require      https://touchedbydarkness.github.io/stuff/ppf_bot_2/initer.user.js
// @connect      pixunivers.fun
// @match        *://*.pixunivers.fun/*
// ==/UserScript==

(function() {
    'use strict';
    
    console.log('🔧 Патчинг для pixunivers.fun...');
    
    // Ждём загрузки оригинального скрипта
    setTimeout(() => {
        if (typeof unsafeWindow.nn === 'undefined') {
            console.error('❌ Оригинальный скрипт не загрузился');
            return;
        }
        
        const nn = unsafeWindow.nn;
        const xe = unsafeWindow.xe;
        const ke = unsafeWindow.ke;
        const sn = unsafeWindow.sn;
        
        // Создаём API для pixunivers
        class PixuniversAPI extends nn {
            getWsUrl() {
                return location.origin.replace(/^http/, 'ws') + '/ws';
            }
            
            getChunkUrl(coords) {
                return `${location.origin}/chunks/${this.canvasId}/${coords[0]}/${coords[1]}.bmp`;
            }
            
            static async fetchSiteCanvases() {
                const r = await fetch(location.origin + '/api/me');
                return await r.json();
            }
            
            static async build(canvasId) {
                const data = await this.getMe();
                const instance = new this({ canvasId });
                instance.info = ke(data.canvases[canvasId]);
                await instance.ws.connect();
                return instance;
            }
            
            static async getMe() {
                if (!this.me) this.me = await this.fetchSiteCanvases();
                return this.me;
            }
            
            static async getCanvasIdByCanvasIdent(ident) {
                const data = await this.getMe();
                for (const [id, canvas] of Object.entries(data.canvases)) {
                    if (canvas.ident === ident) return +id;
                }
                throw new Error('Canvas not found');
            }
        }
        
        // Переопределяем En
        unsafeWindow.En = async () => {
            const char = (location.hash.match(/#([a-z])/) || [])[1] || 'd';
            const id = await PixuniversAPI.getCanvasIdByCanvasIdent(char);
            return [await PixuniversAPI.build(id), await sn()];
        };
        
        console.log('✅ Патч применён');
        
    }, 1000);
    
})();
