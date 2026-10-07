import { events } from "./data.js";

const form = document.querySelector("#etkinlik-formu");
const mesajKutusu = document.querySelector("#form-mesaj");

// GÜNCELLEME SAYFASI MI KONTROLÜ (Adım 11)
if (form && form.dataset.mode === "guncelle") {
    const id = new URLSearchParams(location.search).get("id");
    const etkinlik = events.find((e) => e.id === id);

    if (etkinlik) {
        // ID doğruysa: Formu etkinliğin mevcut bilgileriyle doldur
        form.elements["etkinlik-adi"].value = etkinlik.title;
        form.elements["kategori"].value = etkinlik.category;
        form.elements["tarih"].value = etkinlik.date;
        form.elements["saat"].value = etkinlik.time;
        form.elements["yer"].value = etkinlik.location;
        form.elements["kontenjan"].value = etkinlik.capacity || "";
        form.elements["aciklama"].value = etkinlik.description;
    } else {
        // ID yanlışsa veya yoksa: Formu gizle, uyarı ver
        form.outerHTML = `
            <div style="border: 2px solid #e74c3c; padding: 1.5rem; border-radius: 8px; color: #e74c3c; background: #fdf0ed; text-align: center;">
                Güncellenecek etkinlik seçilmedi. Önce listeden bir etkinlik seçin, detay sayfasındaki "Bu etkinliği güncelle" butonunu kullanın.
                <br><br>
                <a href="etkinlikler.html" class="btn" style="background: #27ae60; color: white; padding: 0.5rem 1rem; text-decoration: none; border-radius: 4px; display: inline-block;">Etkinliklere git</a>
            </div>
        `;
    }
}

// FORM GÖNDERME VE DOĞRULAMA (Adım 9 ve 10)
if (document.querySelector("#etkinlik-formu")) { // Form ekranda duruyorsa dinle
    form.addEventListener("submit", (e) => {
        e.preventDefault(); // Sayfanın yenilenmesini engelle

        // Eski hata mesajlarını ve kırmızı kenarlıkları temizle
        document.querySelectorAll(".hata-metni").forEach(span => span.textContent = "");
        Array.from(form.elements).forEach(el => el.removeAttribute("aria-invalid"));
        mesajKutusu.innerHTML = "";

        const fd = new FormData(form);
        
        // 1. Verileri nesneye (Object) dönüştür
        const data = {
            id: form.dataset.mode === "guncelle" ? new URLSearchParams(location.search).get("id") : "event-7",
            title: fd.get("etkinlik-adi").trim(),
            category: fd.get("kategori"),
            date: fd.get("tarih"),
            time: fd.get("saat"),
            location: fd.get("yer").trim(),
            capacity: fd.get("kontenjan") ? Number(fd.get("kontenjan")) : null,
            description: fd.get("aciklama").trim()
        };

        const errors = {};

        // 2. Doğrulama Kuralları
        if (data.title.length < 3) errors["etkinlik-adi"] = "Etkinlik adı en az 3 karakter olmalı.";
        if (!data.category) errors["kategori"] = "Bir kategori seçin.";
        if (!data.date) errors["tarih"] = "Tarih seçin.";
        if (!data.time) errors["saat"] = "Saat seçin.";
        if (!data.location) errors["yer"] = "Yer bilgisini yazın.";
        if (data.capacity && (data.capacity < 1 || data.capacity > 1000)) errors["kontenjan"] = "Kontenjan 1 ile 1000 arasında olmalıdır.";

        // 3. Hata Varsa Ekrana Bas ve Durdur
        if (Object.keys(errors).length > 0) {
            for (const [alanId, mesaj] of Object.entries(errors)) {
                document.querySelector(`#${alanId}-hata`).textContent = mesaj;
                document.querySelector(`#${alanId}`).setAttribute("aria-invalid", "true");
            }
            return; // Kaydetme işleminden çık
        }

        // 4. Hata Yoksa Başarı Mesajını ve JSON'ı Göster
        mesajKutusu.innerHTML = `
            <div style="border: 2px solid #27ae60; padding: 1.5rem; border-radius: 8px; background: #eafaf1;">
                <p style="color: #27ae60; font-weight: bold; margin-bottom: 0.5rem;">Etkinlik oluşturuldu (bu sprintte kaydedilmez):</p>
                <pre style="background: white; padding: 1rem; border-radius: 4px; overflow-x: auto; font-family: monospace;">${JSON.stringify(data, null, 2)}</pre>
            </div>
        `;
    });
}