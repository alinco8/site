let convertedVapidKey, subscription;

(async (_) => {
    try {
        (await navigator.serviceWorker.getRegistration()) && (await navigator.serviceWorker.getRegistration()).unregister();
        const registration = await navigator.serviceWorker.register('/sw.js', { scope: '/' });

        // サーバー側で生成したパブリックキーを取得し、urlBase64ToUint8Array()を使ってUit8Arrayに変換
        const res = await fetch('/key');
        const vapidPublicKey = await res.text();
        convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

        // (変換した)パブリックキーをapplicationServerKeyに設定してsubscribe
        documentLog('subscribe' in registration.pushManager, 'normal');
        subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: convertedVapidKey,
        });

        // 通知の許可を求める
        Notification.requestPermission((permission) => {
            documentLog(permission); // 'default', 'granted', 'denied'
        });
        documentLog(JSON.stringify(subscription));
    } catch (err) {
        documentLog(err, 'error');
    }
})();

document.querySelector('button').onclick = async (evt) => {
    if (!subscription) return documentLog('sbuscription is null');
    await fetch('/webpushtest', {
        method: 'POST',
        body: JSON.stringify(subscription),
        headers: {
            'Content-Type': 'application/json',
        },
    });
};

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

/**
 *
 * @param {string} body
 * @param {("error"|"normal")} type
 */
function documentLog(text, type = 'normal') {
    const date = new Date();
    const tr = document.createElement('tr');
    const time = document.createElement('td');
    const body = document.createElement('td');
    tr.append(time, body);
    document.querySelector('table').append(tr);
    tr.classList.add(type);
    time.innerText = [date.getHours(), date.getMinutes(), date.getSeconds()].join(':');
    body.innerText = text;
}
