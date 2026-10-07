import { events } from "./data.js";

const list = document.querySelector("#etkinlik-listesi");
const aramaKutusu = document.querySelector("#arama");
const kategoriSecici = document.querySelector("#kategori-filtre");
const sonucSatiri = document.querySelector("#sonuc");

function formatTarih(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("tr-TR", { day: 'numeric', month: 'long', year: 'numeric' });
}

function createCard(event) {
    return `
    <article class="card">
        <h3>${event.title}</h3>
        <p>${event.category}</p>
        <p>Tarih: ${formatTarih(event.date)}, ${event.time}</p>
        <p>Yer: ${event.location}</p>
        <p>Kontenjan: ${event.capacity} kişi</p>
        <p>${event.description}</p>
        <a href="etkinlik-detay.html?id=${event.id}" class="btn">Detayları gör →</a>
    </article>`;
}

function render(dizi) {
    list.innerHTML = dizi.map(createCard).join("");
}

// Ana sayfa mı yoksa Etkinlikler sayfası mı?
if (list.dataset.limit) {
    // Ana Sayfa (Tarihe göre sırala, ilk 2'yi al)
    const yaklasan = [...events]
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(0, Number(list.dataset.limit));
    render(yaklasan);
} else {
    // Etkinlikler Sayfası
    render(events);
    sonucSatiri.textContent = `${events.length} etkinlik listeleniyor.`;

    // Kategorileri dinamik oluştur
    const kategoriler = new Set(events.map(e => e.category));
    kategoriler.forEach(kat => {
        const option = document.createElement("option");
        option.value = kat.toLowerCase();
        option.textContent = kat;
        kategoriSecici.appendChild(option);
    });

    // Filtreleme Fonksiyonu
    function filtrele() {
        const aranan = aramaKutusu.value.toLocaleLowerCase("tr-TR");
        const secilenKategori = kategoriSecici.value;

        const sonuc = events.filter(e => {
            const metinUyuyor = e.title.toLocaleLowerCase("tr-TR").includes(aranan) || 
                                e.description.toLocaleLowerCase("tr-TR").includes(aranan);
            const kategoriUyuyor = secilenKategori === "" || e.category.toLowerCase() === secilenKategori;
            return metinUyuyor && kategoriUyuyor;
        });

        if(sonuc.length === 0) {
            list.innerHTML = "";
            sonucSatiri.textContent = "Aramanıza uygun etkinlik bulunamadı.";
            sonucSatiri.style.color = "darkred";
        } else {
            render(sonuc);
            sonucSatiri.textContent = `${sonuc.length} etkinlik listeleniyor.`;
            sonucSatiri.style.color = "black";
        }
    }

    aramaKutusu.addEventListener("input", filtrele);
    kategoriSecici.addEventListener("change", filtrele);
    document.querySelector("#filtre-formu").addEventListener("submit", e => e.preventDefault());
}