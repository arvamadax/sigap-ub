import { Question } from '../types';

// GAD-7 — Generalized Anxiety Disorder (7 items)
export const GAD7_QUESTIONS: Question[] = [
  {
    id: 1,
    text: "Seberapa sering Anda merasa gugup, cemas, atau sangat tegang dalam 2 minggu terakhir?",
    options: [
      { score: 0, text: "Tidak pernah sama sekali" },
      { score: 1, text: "Beberapa hari" },
      { score: 2, text: "Lebih dari separuh waktu" },
      { score: 3, text: "Hampir setiap hari" },
    ],
  },
  {
    id: 2,
    text: "Seberapa sering Anda merasa tidak mampu menghentikan atau mengendalikan kekhawatiran Anda?",
    options: [
      { score: 0, text: "Tidak pernah sama sekali" },
      { score: 1, text: "Beberapa hari" },
      { score: 2, text: "Lebih dari separuh waktu" },
      { score: 3, text: "Hampir setiap hari" },
    ],
  },
  {
    id: 3,
    text: "Seberapa sering Anda merasa cemas, gelisah, atau khawatir dalam 2 minggu terakhir?",
    options: [
      { score: 0, text: "Tidak pernah sama sekali" },
      { score: 1, text: "Beberapa hari" },
      { score: 2, text: "Lebih dari separuh waktu" },
      { score: 3, text: "Hampir setiap hari" },
    ],
  },
  {
    id: 4,
    text: "Seberapa sering Anda mengalami kesulitan untuk relaks/santai dalam 2 minggu terakhir?",
    options: [
      { score: 0, text: "Tidak pernah sama sekali" },
      { score: 1, text: "Beberapa hari" },
      { score: 2, text: "Lebih dari separuh waktu" },
      { score: 3, text: "Hampir setiap hari" },
    ],
  },
  {
    id: 5,
    text: "Seberapa sering Anda merasa sangat gelisah sehingga tidak bisa diam dalam 2 minggu terakhir?",
    options: [
      { score: 0, text: "Tidak pernah sama sekali" },
      { score: 1, text: "Beberapa hari" },
      { score: 2, text: "Lebih dari separuh waktu" },
      { score: 3, text: "Hampir setiap hari" },
    ],
  },
  {
    id: 6,
    text: "Seberapa sering Anda menjadi mudah kesal atau lekas marah dalam 2 minggu terakhir?",
    options: [
      { score: 0, text: "Tidak pernah sama sekali" },
      { score: 1, text: "Beberapa hari" },
      { score: 2, text: "Lebih dari separuh waktu" },
      { score: 3, text: "Hampir setiap hari" },
    ],
  },
  {
    id: 7,
    text: "Seberapa sering Anda merasa takut seolah-olah sesuatu yang buruk akan terjadi dalam 2 minggu terakhir?",
    options: [
      { score: 0, text: "Tidak pernah sama sekali" },
      { score: 1, text: "Beberapa hari" },
      { score: 2, text: "Lebih dari separuh waktu" },
      { score: 3, text: "Hampir setiap hari" },
    ],
  },
];

// PHQ-9 — Patient Health Questionnaire (9 items)
export const PHQ9_QUESTIONS: Question[] = [
  {
    id: 1,
    text: "Kurang berminat atau kurang bergairah dalam melakukan sesuatu dalam 2 minggu terakhir?",
    options: [
      { score: 0, text: "Tidak pernah sama sekali" },
      { score: 1, text: "Beberapa hari" },
      { score: 2, text: "Lebih dari separuh waktu" },
      { score: 3, text: "Hampir setiap hari" },
    ],
  },
  {
    id: 2,
    text: "Merasa murung, sedih, atau putus asa dalam 2 minggu terakhir?",
    options: [
      { score: 0, text: "Tidak pernah sama sekali" },
      { score: 1, text: "Beberapa hari" },
      { score: 2, text: "Lebih dari separuh waktu" },
      { score: 3, text: "Hampir setiap hari" },
    ],
  },
  {
    id: 3,
    text: "Mengalami kesulitan tidur, sering terbangun, atau terlalu banyak tidur dalam 2 minggu terakhir?",
    options: [
      { score: 0, text: "Tidak pernah sama sekali" },
      { score: 1, text: "Beberapa hari" },
      { score: 2, text: "Lebih dari separuh waktu" },
      { score: 3, text: "Hampir setiap hari" },
    ],
  },
  {
    id: 4,
    text: "Merasa lelah atau kurang bertenaga dalam 2 minggu terakhir?",
    options: [
      { score: 0, text: "Tidak pernah sama sekali" },
      { score: 1, text: "Beberapa hari" },
      { score: 2, text: "Lebih dari separuh waktu" },
      { score: 3, text: "Hampir setiap hari" },
    ],
  },
  {
    id: 5,
    text: "Kurang nafsu makan atau makan berlebihan dalam 2 minggu terakhir?",
    options: [
      { score: 0, text: "Tidak pernah sama sekali" },
      { score: 1, text: "Beberapa hari" },
      { score: 2, text: "Lebih dari separuh waktu" },
      { score: 3, text: "Hampir setiap hari" },
    ],
  },
  {
    id: 6,
    text: "Merasa rendah diri — merasa gagal, mengecewakan diri sendiri atau keluarga dalam 2 minggu terakhir?",
    options: [
      { score: 0, text: "Tidak pernah sama sekali" },
      { score: 1, text: "Beberapa hari" },
      { score: 2, text: "Lebih dari separuh waktu" },
      { score: 3, text: "Hampir setiap hari" },
    ],
  },
  {
    id: 7,
    text: "Sulit berkonsentrasi pada sesuatu, misalnya membaca koran atau menonton televisi dalam 2 minggu terakhir?",
    options: [
      { score: 0, text: "Tidak pernah sama sekali" },
      { score: 1, text: "Beberapa hari" },
      { score: 2, text: "Lebih dari separuh waktu" },
      { score: 3, text: "Hampir setiap hari" },
    ],
  },
  {
    id: 8,
    text: "Bergerak atau berbicara sangat lambat sehingga orang lain memperhatikannya? Atau sebaliknya, merasa gelisah sehingga bergerak lebih sering dari biasanya?",
    options: [
      { score: 0, text: "Tidak pernah sama sekali" },
      { score: 1, text: "Beberapa hari" },
      { score: 2, text: "Lebih dari separuh waktu" },
      { score: 3, text: "Hampir setiap hari" },
    ],
  },
  {
    id: 9,
    text: "Merasa lebih baik mati, atau ingin menyakiti diri sendiri dengan cara tertentu dalam 2 minggu terakhir?",
    options: [
      { score: 0, text: "Tidak pernah sama sekali" },
      { score: 1, text: "Beberapa hari" },
      { score: 2, text: "Lebih dari separuh waktu" },
      { score: 3, text: "Hampir setiap hari" },
    ],
  },
];

// SRQ-20 — Self-Reporting Questionnaire (20 items, binary Yes/No)
export const SRQ20_QUESTIONS: Question[] = [
  { id: 1,  text: "Apakah Anda sering menderita sakit kepala dalam 1 bulan terakhir?",                              options: [{ score: 0, text: "Tidak" }, { score: 1, text: "Ya" }] },
  { id: 2,  text: "Apakah Anda tidak nafsu makan dalam 1 bulan terakhir?",                                         options: [{ score: 0, text: "Tidak" }, { score: 1, text: "Ya" }] },
  { id: 3,  text: "Apakah Anda sulit tidur dalam 1 bulan terakhir?",                                               options: [{ score: 0, text: "Tidak" }, { score: 1, text: "Ya" }] },
  { id: 4,  text: "Apakah Anda mudah merasa takut dalam 1 bulan terakhir?",                                        options: [{ score: 0, text: "Tidak" }, { score: 1, text: "Ya" }] },
  { id: 5,  text: "Apakah Anda merasa cemas, tegang, atau khawatir dalam 1 bulan terakhir?",                       options: [{ score: 0, text: "Tidak" }, { score: 1, text: "Ya" }] },
  { id: 6,  text: "Apakah tangan Anda gemetar dalam 1 bulan terakhir?",                                            options: [{ score: 0, text: "Tidak" }, { score: 1, text: "Ya" }] },
  { id: 7,  text: "Apakah pencernaan Anda terganggu atau merasa tidak enak di perut?",                             options: [{ score: 0, text: "Tidak" }, { score: 1, text: "Ya" }] },
  { id: 8,  text: "Apakah Anda sulit berpikir jernih dalam 1 bulan terakhir?",                                     options: [{ score: 0, text: "Tidak" }, { score: 1, text: "Ya" }] },
  { id: 9,  text: "Apakah Anda merasa tidak bahagia dalam 1 bulan terakhir?",                                      options: [{ score: 0, text: "Tidak" }, { score: 1, text: "Ya" }] },
  { id: 10, text: "Apakah Anda menangis lebih sering dalam 1 bulan terakhir?",                                     options: [{ score: 0, text: "Tidak" }, { score: 1, text: "Ya" }] },
  { id: 11, text: "Apakah Anda merasa kesulitan untuk menikmati aktivitas sehari-hari?",                           options: [{ score: 0, text: "Tidak" }, { score: 1, text: "Ya" }] },
  { id: 12, text: "Apakah Anda kesulitan untuk mengambil keputusan dalam 1 bulan terakhir?",                       options: [{ score: 0, text: "Tidak" }, { score: 1, text: "Ya" }] },
  { id: 13, text: "Apakah aktivitas pekerjaan atau belajar sehari-hari Anda menjadi terganggu?",                   options: [{ score: 0, text: "Tidak" }, { score: 1, text: "Ya" }] },
  { id: 14, text: "Apakah Anda tidak mampu melakukan hal-hal yang berharga dalam hidup?",                          options: [{ score: 0, text: "Tidak" }, { score: 1, text: "Ya" }] },
  { id: 15, text: "Apakah Anda kehilangan minat pada berbagai hal dalam hidup?",                                   options: [{ score: 0, text: "Tidak" }, { score: 1, text: "Ya" }] },
  { id: 16, text: "Apakah Anda merasa tidak berharga dalam 1 bulan terakhir?",                                     options: [{ score: 0, text: "Tidak" }, { score: 1, text: "Ya" }] },
  { id: 17, text: "Apakah Anda mempunyai pikiran untuk mengakhiri hidup dalam 1 bulan terakhir?",                  options: [{ score: 0, text: "Tidak" }, { score: 1, text: "Ya" }] },
  { id: 18, text: "Apakah Anda merasa lelah sepanjang waktu dalam 1 bulan terakhir?",                              options: [{ score: 0, text: "Tidak" }, { score: 1, text: "Ya" }] },
  { id: 19, text: "Apakah Anda mudah lelah dalam beraktivitas harian?",                                            options: [{ score: 0, text: "Tidak" }, { score: 1, text: "Ya" }] },
  { id: 20, text: "Apakah Anda merasa tidak enak di dada atau jantung berdebar-debar?",                            options: [{ score: 0, text: "Tidak" }, { score: 1, text: "Ya" }] },
];
