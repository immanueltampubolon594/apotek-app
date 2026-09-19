<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Obat;
use App\Models\Kategori;

class ObatSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Daftar Kategori Sesuai Screenshot
        $categories = [
            "Women's Health", "Skin & Hair", "Child Specialist", 
            "Lungs and Breathing", "Dental Care", "Ear Nose Throat",
            "Homeopathy", "Bone and Joints", "Sex Specialist", 
            "Eye Specialist", "Digestive Issues", "Mental Wellness",
            "Heart", "Diabetes Management", "Brain and Nerves",
            "Urinary Issues", "Kidney Issues", "Ayurveda", "Vitamins", "Wellness"
        ];

        // Buat Kategori di Database
        $catIds = [];
        foreach ($categories as $name) {
            $cat = Kategori::updateOrCreate(['nama' => $name]);
            $catIds[$name] = $cat->id;
        }

        // 2. Data Obat Contoh untuk setiap Kategori
        $dataObat = [
            ["Women's Health", "Sangobion Caps", 25000, "Zat besi untuk penambah darah.", "https://vivahealth.co.id/storage/product/181/SANGOBION%20CAPS%20STRIP%2010%20S%20-%20VIVA%20HEALTH.png"],
            ["Skin & Hair", "Biotin 10000mcg", 150000, "Vitamin untuk kesehatan rambut dan kuku.", "https://images.tokopedia.net/img/cache/700/Vqb7p4/2022/3/10/88e8b0e7-8b0b-4b1e-9e1e-7e1e7e1e7e1e.jpg"],
            ["Child Specialist", "Tempra Syrup 60ml", 55000, "Obat penurun demam khusus anak.", "https://vivahealth.co.id/storage/product/1018/TEMPRA%20SYRUP%2060%20ML%20-%20VIVA%20HEALTH.png"],
            ["Lungs and Breathing", "OBH Combi Batuk", 18000, "Meredakan batuk berdahak.", "https://images.tokopedia.net/img/cache/700/product-1/2019/11/26/4351651/4351651_7e3a9b1c-7b1e-4b1e-9e1e-7e1e7e1e7e1e.jpg"],
            ["Dental Care", "Ponstan 500mg", 35000, "Meredakan sakit gigi dan nyeri.", "https://vivahealth.co.id/storage/product/1004/PONSTAN%20500%20MG%20TABLET%20-%20VIVA%20HEALTH.png"],
            ["Ear Nose Throat", "Degirol Tablet", 15000, "Obat radang tenggorokan.", "https://vivahealth.co.id/storage/product/2001/DEGIROL%200.25%20MG%20TABLET%20-%20VIVA%20HEALTH.png"],
            ["Homeopathy", "Arnica Montana", 120000, "Suplemen pemulihan jaringan tubuh.", "https://images.tokopedia.net/img/cache/700/Vqb7p4/2021/1/1/88e8b0e7-8b0b-4b1e-9e1e-7e1e7e1e7e1e.jpg"],
            ["Bone and Joints", "CDR Effervescent", 45000, "Kalsium untuk kesehatan tulang.", "https://vivahealth.co.id/storage/product/105/CDR%20EFFERVESCENT%2010%20S%20-%20VIVA%20HEALTH.png"],
            ["Sex Specialist", "Zinc Capsules", 85000, "Meningkatkan stamina dan hormon.", "https://images.tokopedia.net/img/cache/700/Vqb7p4/2020/1/1/88e8b0e7-8b0b-4b1e-9e1e-7e1e7e1e7e1e.jpg"],
            ["Eye Specialist", "Insto Regular", 15000, "Meredakan mata merah dan iritasi.", "https://vivahealth.co.id/storage/product/108/INSTO%20REGULAR%20EYE%20DROPS%207.5%20ML%20-%20VIVA%20HEALTH.png"],
            ["Digestive Issues", "Diapet Caps", 5000, "Meredakan diare dan sakit perut.", "https://vivahealth.co.id/storage/product/211/DIAPET%20CAPS%20STRIP%204%20S%20-%20VIVA%20HEALTH.png"],
            ["Mental Wellness", "Neurobion Forte", 42000, "Vitamin untuk syaraf dan kelelahan.", "https://vivahealth.co.id/storage/product/115/NEUROBION%20FORTE%20STRIP%2010%20S%20-%20VIVA%20HEALTH.png"],
            ["Heart", "Aspilets 80mg", 25000, "Pengencer darah untuk kesehatan jantung.", "https://images.tokopedia.net/img/cache/700/Vqb7p4/2021/4/26/d883b38c-66f6-4f76-8868-232f1437167a.jpg"],
            ["Diabetes Management", "Metformin 500mg", 12000, "Mengontrol kadar gula darah.", "https://vivahealth.co.id/storage/product/1230/METFORMIN%20HCL%20500%20MG%20TABLET%20-%20VIVA%20HEALTH.png"],
            ["Brain and Nerves", "Enervon C", 38000, "Menjaga daya tahan syaraf dan otak.", "https://vivahealth.co.id/storage/product/123/ENERVON-C%20MULTIVITAMIN%20STRIP%204%20S%20-%20VIVA%20HEALTH.png"],
            ["Urinary Issues", "Batugin Elixir", 48000, "Membantu meluruhkan batu urin.", "https://vivahealth.co.id/storage/product/205/BATUGIN%20ELIXIR%20120%20ML%20-%20VIVA%20HEALTH.png"],
            ["Kidney Issues", "Nephrolit Caps", 22000, "Membantu memelihara kesehatan ginjal.", "https://vivahealth.co.id/storage/product/2005/NEPHROLIT%20CAPS%20STRIP%205%20S%20-%20VIVA%20HEALTH.png"],
            ["Ayurveda", "Tolak Angin Cair", 4000, "Herbal untuk masuk angin.", "https://images.tokopedia.net/img/cache/700/Vqb7p4/2021/1/1/88e8b0e7-8b0b-4b1e-9e1e-7e1e7e1e7e1e.jpg"],
            ["Vitamins", "Seven Seas Cod Liver", 39000, "Minyak hati ikan kod murni.", "https://www.purnamamedika.com/assets/images/product/seven-seas-original-500ml.png"],
            ["Wellness", "Dabur Chyawanprash", 80500, "Herbal peningkat imunitas tubuh.", "https://www.dabur.com/amp/in/en-us/images/product/chyawanprash-500g.png"],
        ];

        // Masukkan data obat ke tabel obats
        foreach ($dataObat as $item) {
            Obat::create([
                'kategori_id' => $catIds[$item[0]],
                'nama'        => $item[1],
                'harga'       => $item[2],
                'stok'        => 100,
                'deskripsi'   => $item[3],
                'foto'        => $item[4],
            ]);
        }
    }
}