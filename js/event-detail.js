import { events } from "./data.js";

const container = document.querySelector("#detay");
const id = new URLSearchParams(location.search).get("id");
const event = events.find(e => e.id === id);

function formatTarih(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("tr-TR", { day: 'numeric', month: 'long', year: 'numeric' });
}

if (!event) {
    container.innerHTML = `
        <div style="border: 2px solid #e74c3c; padding: 1.5rem; border-radius: 8px; color: #e74c3c; background: #fdf0ed; width: 100%;">
            <h2 style="color: #e74c3c; margin-bottom: 0.5rem;">Etkinlik bulunamadı</h2>
            <p>"${id || 'Bilinmeyen'}" numaralı bir etkinlik yok. Lütfen listeden geçerli bir etkinlik seçin.</p>
            <br>
            <a href="etkinlikler.html" class="btn" style="background: #e74c3c; color: white; padding: 0.5rem 1rem; text-decoration: none; border-radius: 4px;">Listeye dön</a>
        </div>
    `;
} else {
    document.title = `${event.title} - Etkinlik Detayı`;
    
    container.innerHTML = `
        <figure>
            <img src="afis.jpg" alt="${event.title} afişi" onerror="this.style.display='none'">
            <figcaption>${event.title} afişi</figcaption>
        </figure>

        <div class="detay-bilgi" style="width: 100%;">
            <h2 style="margin-bottom: 1rem; color: var(--renk-ana);">${event.title}</h2>
            <dl>
                <dt>Tarih</dt>
                <dd><time datetime="${event.date}T${event.time}">${formatTarih(event.date)}, ${event.time}</time></dd>

                <dt>Yer</dt>
                <dd>${event.location}</dd>

                <dt>Kategori</dt>
                <dd>${event.category}</dd>

                <dt>Kontenjan</dt>
                <dd>${event.capacity} kişi</dd>
            </dl>

            <h3 style="margin: 1rem 0 0.5rem 0;">Açıklama</h3>
            <p>${event.description}</p>
            <br>
            
            <!-- İŞTE GÜNCELLE BUTONU BURADA EKLENİYOR -->
            <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin-top: 1rem;">
                <a href="etkinlikler.html" class="btn" style="background: #555; color: white; padding: 0.5rem 1rem; border-radius: 4px; text-decoration: none;">← Listeye dön</a>
                <a href="etkinlik-guncelle.html?id=${event.id}" class="btn" style="background: var(--renk-ana); color: white; padding: 0.5rem 1rem; border-radius: 4px; text-decoration: none;">Bu etkinliği güncelle</a>
            </div>
        </div>
    `;
}