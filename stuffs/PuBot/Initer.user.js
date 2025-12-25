// ==UserScript==
// @name         PuBot для pixunivers.fun
// @version      1.0.4
// @author       Darkness Remaked by Puwe
// @description  Bot для pixunivers.fun - готовая версия
// @icon         https://raw.githubusercontent.com/TouchedByDarkness/PixelPlanet-Bot/master/rounded-avatar-128.png
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @grant        unsafeWindow
// @run-at       document-start
// @connect      pixunivers.fun
// @match        *://*.pixunivers.fun/*
// ==/UserScript==

(function() {
'use strict';

console.log(`
╔════════════════════════════════════════╗
║   PuBot для pixunivers.fun v1.0.4     ║
║   Готовая версия - без ручной вставки  ║
╚════════════════════════════════════════╝
`);

// Проверка сайта
if (!/pixunivers\.fun/.test(location.origin)) {
    console.error('❌ Работает только на pixunivers.fun');
    return;
}

// Загружаем оригинальный скрипт напрямую
const loadOriginalScript = () => {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://touchedbydarkness.github.io/stuff/ppf_bot_2/initer.user.js',
            onload: (response) => {
                console.log('📥 Оригинальный скрипт загружен');
                
                // Удаляем проверку обновлений и ограничения по доменам
                let code = response.responseText;
                
                // Убираем проверку версии
                code = code.replace(/fetch\(GM_info\.script\.updateURL[^}]+\}/g, '');
                
                // Убираем все проверки домена
                code = code.replace(/\/\*.*pixelplanet.*\*\//g, '');
                code = code.replace(/if\s*\(\/.*pixelplanet.*\.test\([^)]+\)\)/g, 'if(true)');
                
                // Заменяем все упоминания доменов на pixunivers
                code = code.replace(/pixelplanet\.fun/g, 'pixunivers.fun');
                code = code.replace(/fuckyouarkeros\.fun/g, 'pixunivers.fun');
                
                // Внедряем код
                const script = document.createElement('script');
                script.textContent = code + `
                
                // ========================================
                // ПАТЧ ДЛЯ PIXUNIVERS.FUN
                // ========================================
                (function() {
                    console.log('🔧 Применяю патч для pixunivers.fun...');
                    
                    // Находим класс API (он может называться по-разному из-за минификации)
                    let BaseAPIClass = null;
                    
                    // Пробуем найти через известные имена
                    if (typeof nn !== 'undefined') {
                        BaseAPIClass = nn;
                    } else if (typeof an !== 'undefined') {
                        BaseAPIClass = an;
                    } else if (typeof pn !== 'undefined') {
                        BaseAPIClass = pn;
                    }
                    
                    if (!BaseAPIClass) {
                        console.error('❌ Не найден базовый класс API');
                        return;
                    }
                    
                    console.log('✅ Базовый класс найден:', BaseAPIClass.name);
                    
                    // Создаём кастомный API
                    class PixuniversAPI extends BaseAPIClass {
                        constructor(config) {
                            super(config);
                            console.log('🏗️ PixuniversAPI создан для канваса', config.canvasId);
                        }
                        
                        getWsUrl() {
                            const url = location.origin.replace(/^http/, 'ws') + '/ws';
                            console.log('🔌 WebSocket URL:', url);
                            return url;
                        }
                        
                        getChunkUrl(coords) {
                            const url = location.origin + '/chunks/' + this.canvasId + '/' + coords[0] + '/' + coords[1] + '.bmp';
                            return url;
                        }
                        
                        static async fetchSiteCanvases() {
                            console.log('📡 Загружаю данные канвасов...');
                            try {
                                const response = await fetch(location.origin + '/api/me', {
                                    credentials: 'include',
                                    headers: { 'Accept': 'application/json' }
                                });
                                
                                if (!response.ok) {
                                    throw new Error('HTTP ' + response.status);
                                }
                                
                                const data = await response.json();
                                console.log('✅ Данные получены:', data);
                                return data;
                            } catch (error) {
                                console.error('❌ Ошибка загрузки:', error);
                                throw error;
                            }
                        }
                        
                        static async build(canvasId) {
                            console.log('🏗️ Строю API для канваса', canvasId);
                            
                            const data = await this.getMe();
                            const instance = new this({ canvasId: canvasId });
                            
                            // Используем функцию ke из оригинального кода
                            if (typeof ke !== 'undefined') {
                                instance.info = ke(data.canvases[canvasId]);
                                console.log('📋 Инфо канваса:', instance.info);
                            }
                            
                            await instance.ws.connect();
                            console.log('✅ API готов');
                            
                            return instance;
                        }
                        
                        static async getMe() {
                            if (!this.me) {
                                this.me = await this.fetchSiteCanvases();
                            }
                            return this.me;
                        }
                        
                        static async getCanvasIdByCanvasIdent(ident) {
                            const data = await this.getMe();
                            
                            for (const [id, canvas] of Object.entries(data.canvases)) {
                                if (canvas.ident === ident) {
                                    console.log('🎯 Канвас найден:', ident, '→', id);
                                    return parseInt(id);
                                }
                            }
                            
                            throw new Error('Канвас "' + ident + '" не найден');
                        }
                    }
                    
                    // Экспортируем в глобальную область
                    window.PixuniversAPI = PixuniversAPI;
                    
                    // Переопределяем функцию инициализации En
                    const originalEn = En;
                    
                    En = async function() {
                        console.log('🚀 Запуск инициализации...');
                        
                        try {
                            // Получаем ID канваса из URL
                            const hashMatch = location.hash.match(/#([a-z])/);
                            const canvasChar = hashMatch ? hashMatch[1] : 'd';
                            console.log('📍 Канвас из URL:', canvasChar);
                            
                            const canvasId = await PixuniversAPI.getCanvasIdByCanvasIdent(canvasChar);
                            
                            // Создаём canvas state manager (функция sn из оригинального кода)
                            let canvasState = null;
                            if (typeof sn !== 'undefined') {
                                canvasState = await sn();
                            }
                            
                            // Создаём API
                            const api = await PixuniversAPI.build(canvasId);
                            
                            console.log('✅ Инициализация завершена');
                            
                            return [api, canvasState];
                            
                        } catch (error) {
                            console.error('❌ Ошибка инициализации:', error);
                            console.error('Stack:', error.stack);
                            throw error;
                        }
                    };
                    
                    console.log('✅ Патч применён успешно');
                    
                    // Автозапуск если страница уже загружена
                    if (document.readyState === 'complete' || document.readyState === 'interactive') {
                        console.log('🎬 Страница готова, запускаю бота...');
                    }
                    
                })();
                `;
                
                document.documentElement.appendChild(script);
                script.remove();
                
                console.log('✅ Скрипт внедрён');
                resolve();
            },
            onerror: (error) => {
                console.error('❌ Ошибка загрузки оригинального скрипта:', error);
                reject(error);
            }
        });
    });
};

// Запускаем загрузку
loadOriginalScript().catch(err => {
    console.error('❌ Критическая ошибка:', err);
});

})();
