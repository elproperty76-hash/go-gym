import { WorkoutProgram } from '../types';

export const WORKOUT_PROGRAMS_DATA: WorkoutProgram[] = [
  {
    id: 'prog-1',
    title: 'Program Pemula: Full Body Foundation',
    category: 'Pemula',
    level: 'Pemula',
    durationWeeks: 4,
    daysPerWeek: 3,
    description: 'Program dasar terbaik untuk pemula yang baru memulai latihan angkat beban. Melatih seluruh kelompok otot utama dalam satu sesi untuk membangun koordinasi saraf, kekuatan dasar, dan membiasakan sendi.',
    bannerImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80',
    scheduleDay: 'Senin, Rabu, Jumat (Hari istirahat di antaranya)',
    benefits: [
      'Membangun fondasi postur tubuh yang tegak & kuat',
      'Mempercepat adaptasi otot dan sendi tanpa overtraining',
      'Membakar kalori optimal dengan gerakan multi-sendi (compound)',
      'Aman dan mudah dipelajari dalam 4 minggu pertama'
    ],
    exercises: [
      {
        id: 'ex-1',
        name: 'Goblet Squat (Dumbbell/Kettlebell)',
        targetMuscle: 'Quadriceps, Glutes, Core',
        equipment: 'Dumbbell atau Kettlebell',
        setsReps: '3 Set x 10-12 Repetisi',
        restTime: '60 - 90 Detik',
        difficulty: 'Pemula',
        imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=800&q=80',
        instructions: [
          'Pegang satu dumbbell di depan dada dengan kedua tangan menopang bagian atas dumbbell (seperti memegang piala).',
          'Berdiri tegak dengan kaki dibuka selebar bahu, ujung jari kaki mengarah sedikit keluar (15-30 derajat).',
          'Tarik napas dalam, kunci otot perut (core), lalu dorong pinggul ke belakang dan tekuk lutut perlahan.',
          'Turunkan tubuh hingga paha minimal sejajar dengan lantai, pastikan dada tetap tegak dan punggung netral (tidak melengkung).',
          'Dorong tumit Anda ke lantai untuk kembali berdiri tegak ke posisi awal sembari menghembuskan napas.'
        ],
        tips: [
          'Jangan biarkan lutut tertekuk ke dalam (valgus); dorong lutut sedikit keluar searah jari kaki.',
          'Pertahankan beban tetap menempel dekat di depan dada sepanjang gerakan.'
        ],
        commonMistakes: [
          'Tumit terangkat dari lantai saat turun',
          'Punggung membungkuk ke depan saat menahan beban'
        ]
      },
      {
        id: 'ex-2',
        name: 'Dumbbell Chest Press di Flat Bench',
        targetMuscle: 'Pectoralis Major (Dada), Triceps, Anterior Deltoid',
        equipment: 'Dumbbells & Flat Bench',
        setsReps: '3 Set x 10-12 Repetisi',
        restTime: '60 - 90 Detik',
        difficulty: 'Pemula',
        imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80',
        instructions: [
          'Duduk di ujung bangku datar dengan sepasang dumbbell bertumpu di paha atas Anda.',
          'Rebahkan punggung Anda ke bangku sambil mengangkat dumbbell ke posisi dada dengan kedua kaki menapak kuat di lantai.',
          'Posisikan dumbbell setinggi dada dengan siku membentuk sudut sekitar 45 hingga 60 derajat dari tubuh (bukan 90 derajat sejajar bahu).',
          'Dorong dumbbell ke atas hingga lengan hampir lurus (jangan mengunci sendi siku secara berlebihan).',
          'Turunkan beban kembali perlahan dengan tempo 2-3 detik hingga dada merasakan regangan yang nyaman.'
        ],
        tips: [
          'Tarik bahu ke belakang dan ke bawah (retraksi skapula) agar tekanan maksimal diterima otot dada, bukan sendi bahu.',
          'Hembuskan napas saat mendorong ke atas, tarik napas saat menurunkan beban.'
        ],
        commonMistakes: [
          'Siku terlalu melebar ke samping (90 derajat) yang berisiko mencederai rotator cuff bahu',
          'Kaki bergoyang-goyang atau tidak menapak stabil di lantai'
        ]
      },
      {
        id: 'ex-3',
        name: 'Lat Pulldown (Mesin Kabel)',
        targetMuscle: 'Latissimus Dorsi (Punggung Lebar), Biceps',
        equipment: 'Cable Lat Pulldown Machine',
        setsReps: '3 Set x 12 Repetisi',
        restTime: '60 Detik',
        difficulty: 'Pemula',
        imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80',
        instructions: [
          'Duduk di mesin Lat Pulldown, sesuaikan bantalan paha agar mengunci paha dengan nyaman dan kokoh.',
          'Pegang palang tarik dengan pegangan sedikit lebih lebar dari bahu (pronasi / telapak tangan menghadap ke depan).',
          'Busungkan dada sedikit dan condongkan badan ke belakang sekitar 10-15 derajat.',
          'Tarik palang ke bawah menuju tulang dada bagian atas sambil mengarahkan siku ke bawah dan ke dalam.',
          'Tahan kontraksi otot punggung selama 1 detik, lalu kembalikan palang ke atas secara terkontrol hingga lengan merenggang penuh.'
        ],
        tips: [
          'Fokuskan pikiran menarik beban dengan siku Anda, bukan mengandalkan tenaga cengkeraman tangan atau bisep.',
          'Hindari mengayunkan pinggang ke depan dan belakang untuk menciptakan momentum.'
        ],
        commonMistakes: [
          'Menarik palang ke belakang leher (sangat berbahaya bagi sendi leher dan bahu)',
          'Melepaskan palang kembali ke atas terlalu cepat tanpa kontrol'
        ]
      },
      {
        id: 'ex-4',
        name: 'Dumbbell Romanian Deadlift (RDL)',
        targetMuscle: 'Hamstrings, Glutes, Punggung Bawah',
        equipment: 'Sepasang Dumbbell',
        setsReps: '3 Set x 10-12 Repetisi',
        restTime: '90 Detik',
        difficulty: 'Pemula',
        imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
        instructions: [
          'Berdiri tegak memegang dumbbell di depan paha dengan kaki dibuka selebar pinggul.',
          'Buka bahu ke belakang, kunci otot perut, dan tekuk lutut sangat sedikit (micro-bend).',
          'Lakukan gerakan engsel pinggul (hip hinge): dorong pinggul jauh ke belakang sambil menurunkan dumbbell menyusuri garis kaki.',
          'Turunkan hingga dumbbell berada di bawah tempurung lutut atau sampai Anda merasakan regangan kuat di otot paha belakang (hamstring).',
          'Dorong pinggul kembali ke depan untuk berdiri tegak dengan meremas (squeeze) otot glutes di posisi akhir.'
        ],
        tips: [
          'Punggung harus selalu lurus netral. Bayangkan Anda sedang menutup pintu mobil dengan pantat Anda.',
          'Lutut tidak boleh menekuk lebih banyak saat beban turun; ini bukan gerakan squat.'
        ],
        commonMistakes: [
          'Membungkukkan tulang belakang untuk menjangkau lantai lebih rendah',
          'Membiarkan dumbbell menjauh dari kaki'
        ]
      },
      {
        id: 'ex-5',
        name: 'Plank Hold (Core Stability)',
        targetMuscle: 'Rectus Abdominis, Transverse Abdominis, Core',
        equipment: 'Matras Gym',
        setsReps: '3 Set x 30-45 Detik',
        restTime: '45 Detik',
        difficulty: 'Pemula',
        imageUrl: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?auto=format&fit=crop&w=800&q=80',
        instructions: [
          'Posisikan tubuh telungkup di atas matras dengan bertumpu pada kedua siku dan jari-jari kaki.',
          'Pastikan siku berada tegak lurus tepat di bawah sendi bahu.',
          'Kencangkan otot bokong, paha depan, dan tarik pusar ke arah tulang belakang.',
          'Bentuk garis lurus sempurna dari kepala, leher, punggung, pinggul hingga tumit kaki.',
          'Bernapas teratur dan tenang sambil mempertahankan ketegangan posisi selama waktu yang ditentukan.'
        ],
        tips: [
          'Arahkan pandangan mata sedikit ke depan matras, jangan menekuk leher ke bawah atau mendongak ke atas.',
          'Jika pinggul mulai turun atau punggung terasa pegal, istirahatlah sejenak.'
        ],
        commonMistakes: [
          'Pinggul melorot ke bawah (menyebabkan tekanan berlebih pada pinggang bawah)',
          'Menahan napas saat melakukan gerakan'
        ]
      }
    ]
  },
  {
    id: 'prog-2',
    title: 'Program Push - Pull - Legs (Hipertrofi Otot)',
    category: 'Hipertrofi (Massa Otot)',
    level: 'Menengah',
    durationWeeks: 8,
    daysPerWeek: 4,
    description: 'Split latihan terpopuler untuk memaksimalkan pertumbuhan massa otot (hipertrofi). Memisahkan gerakan dorong tubuh bagian atas (dada, bahu, trisep), gerakan tarik (punggung, bisep), dan latihan kaki secara intensif.',
    bannerImage: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80',
    scheduleDay: 'Senin (Push), Selasa (Pull), Kamis (Legs), Jumat (Upper Body)',
    benefits: [
      'Frekuensi stimulus otot optimal 2x seminggu untuk hipertrofi',
      'Waktu pemulihan otot (recovery) sangat ideal 48-72 jam antar sesi',
      'Kombinasi sempurna antara kekuatan compound dan isolasi otot',
      'Volume latihan terstruktur untuk menebalkan serat otot'
    ],
    exercises: [
      {
        id: 'ex-6',
        name: 'Barbell Incline Bench Press',
        targetMuscle: 'Upper Chest (Dada Bagian Atas), Front Deltoid',
        equipment: 'Incline Bench (30 Derajat) & Barbell',
        setsReps: '4 Set x 8-10 Repetisi',
        restTime: '90 - 120 Detik',
        difficulty: 'Menengah',
        imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80',
        instructions: [
          'Atur sandaran bangku pada sudut inklinasi 30 derajat (hindari lebih dari 45 derajat agar beban tidak beralih ke bahu).',
          'Berbaring dengan mata sejajar tepat di bawah palang barbell.',
          'Genggam palang sedikit lebih lebar dari bahu, kunci skapula bahu ke belakang dan ke bawah.',
          'Angkat palang dari rak, lalu turunkan perlahan menuju tulang dada atas tepat di bawah tulang selangka.',
          'Dorong palang kembali ke atas dengan kuat menggunakan kontraksi otot dada atas.'
        ],
        tips: [
          'Pertahankan pergelangan tangan tetap lurus, tidak tertekuk ke belakang.',
          'Jejakkan kedua kaki kokoh di lantai untuk menghasilkan leg drive yang stabil.'
        ],
        commonMistakes: [
          'Memantulkan palang di tulang dada',
          'Mengangkat pinggul dari bangku saat mendorong beban'
        ]
      },
      {
        id: 'ex-7',
        name: 'Barbell Bent-Over Row',
        targetMuscle: 'Rhomboids, Latissimus Dorsi, Trapezius Tengah',
        equipment: 'Barbell & Weight Plates',
        setsReps: '4 Set x 8-10 Repetisi',
        restTime: '90 Detik',
        difficulty: 'Menengah',
        imageUrl: 'https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?auto=format&fit=crop&w=800&q=80',
        instructions: [
          'Berdiri dengan kaki selebar pinggul dan pegang barbell dengan telapak menghadap tubuh (overhand grip).',
          'Bungkukkan badan ke depan sekitar 45 derajat dengan mendorong pinggul ke belakang, punggung tetap lurus kokoh.',
          'Biarkan barbell menggantung di depan tulang kering dengan lengan lurus.',
          'Tarik barbell menuju perut bagian bawah (pusar) sambil mengarahkan siku ke belakang dan meremas belikat bahu.',
          'Tahan sejenak di puncak kontraksi, lalu turunkan barbell secara terkontrol kembali ke posisi awal.'
        ],
        tips: [
          'Jaga kepala tetap netral sejajar tulang belakang, jangan mendongak berlebihan.',
          'Gunakan sabuk angkat beban (lifting belt) jika menggunakan beban yang mendekati batas maksimal.'
        ],
        commonMistakes: [
          'Menggunakan sentakan badan (jerking) ke atas untuk mengangkat beban',
          'Punggung melengkung bulat (berisiko tinggi cedera lumbal)'
        ]
      },
      {
        id: 'ex-8',
        name: 'Dumbbell Seated Shoulder Overhead Press',
        targetMuscle: 'Deltoid (Bahu Depan & Samping), Triceps',
        equipment: 'Sepasang Dumbbell & Bangku Tegak (75-80 Derajat)',
        setsReps: '3 Set x 10-12 Repetisi',
        restTime: '90 Detik',
        difficulty: 'Menengah',
        imageUrl: 'https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?auto=format&fit=crop&w=800&q=80',
        instructions: [
          'Duduk bersandar tegak pada bangku gym, angkat sepasang dumbbell setinggi bahu dengan telapak menghadap ke depan.',
          'Posisikan siku sedikit mengarah ke depan tubuh (sekitar 30 derajat dalam bidang scapular).',
          'Dorong dumbbell lurus ke atas kepala secara bersamaan hingga lengan terentang hampir lurus.',
          'Pertahankan beban seimbang di atas kepala tanpa membenturkan kedua dumbbell.',
          'Turunkan kembali dengan tempo 2 detik hingga dumbbell sejajar dengan telinga atau bahu Anda.'
        ],
        tips: [
          'Kunci otot perut agar punggung bawah tidak melengkung menjauh dari sandaran bangku.',
          'Tarik napas saat menurunkan dumbbell, hembuskan saat mendorong ke atas.'
        ],
        commonMistakes: [
          'Punggung bawah melengkung berlebihan (lordosis kompensasi beban berat)',
          'Siku terlalu ditarik ke belakang melewati bidang tubuh'
        ]
      },
      {
        id: 'ex-9',
        name: 'Leg Press di Mesin Angkat 45 Derajat',
        targetMuscle: 'Quadriceps, Glutes, Hamstrings',
        equipment: '45-Degree Leg Press Machine',
        setsReps: '4 Set x 10-12 Repetisi',
        restTime: '90 - 120 Detik',
        difficulty: 'Menengah',
        imageUrl: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?auto=format&fit=crop&w=800&q=80',
        instructions: [
          'Duduk di mesin leg press dengan punggung dan kepala bersandar rapat di bantalan kursi.',
          'Tempatkan kaki di platform selebar bahu di tengah papan dorong.',
          'Lepaskan tuas pengaman mesin, lalu tekuk lutut perlahan untuk menurunkan beban ke arah dada.',
          'Turunkan platform hingga sudut lutut mencapai sekitar 90 derajat tanpa membiarkan pinggul Anda terangkat dari kursi.',
          'Dorong kembali platform menggunakan kekuatan tumit dan telapak kaki hingga hampir lurus.'
        ],
        tips: [
          'PENTING: JANGAN PERNAH mengunci lutut (hyper-extension) saat di posisi atas karena sangat berbahaya untuk sendi lutut.',
          'Pastikan pinggang bawah tetap menempel erat di sandaran kursi sepanjang gerakan.'
        ],
        commonMistakes: [
          'Mengunci lutut lurus secara keras di puncak gerakan',
          'Bokong terangkat melengkung saat beban turun maksimal'
        ]
      },
      {
        id: 'ex-10',
        name: 'Cable Triceps Rope Pushdown',
        targetMuscle: 'Triceps Brachii (Kepala Lateral & Medial)',
        equipment: 'Cable Machine & Tali Rope Attachment',
        setsReps: '3 Set x 12-15 Repetisi',
        restTime: '60 Detik',
        difficulty: 'Menengah',
        imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80',
        instructions: [
          'Pasang attachment tali (rope) pada katrol kabel posisi atas mesin.',
          'Pegang kedua ujung tali, condongkan tubuh sedikit ke depan (sekitar 10 derajat) dengan lutut sedikit ditekuk.',
          'Kunci posisi kedua siku di samping tulang rusuk dan jangan digerakkan maju-mundur.',
          'Dorong tali ke bawah menggunakan trisep hingga lengan lurus, lalu renggangkan kedua ujung tali ke samping luar di bagian bawah.',
          'Kembalikan tali ke atas perlahan hingga pergelangan tangan setinggi dada bawah.'
        ],
        tips: [
          'Fokuskan gerakan hanya pada sendi siku; lengan atas harus tetap diam mematung.',
          'Remas dan kunci otot trisep selama 1 detik penuh saat tali terbentang di bawah.'
        ],
        commonMistakes: [
          'Siku bergerak maju mundur menggunakan bantuan bahu',
          'Menggunakan beban terlalu berat sehingga postur tubuh membungkuk menekan tali'
        ]
      }
    ]
  },
  {
    id: 'prog-3',
    title: 'Program Pembakaran Lemak (Fat Loss & Conditioning)',
    category: 'Penurunan Lemak / Fat Loss',
    level: 'Pemula',
    durationWeeks: 6,
    daysPerWeek: 4,
    description: 'Program sirkuit latihan intensif yang menggabungkan latihan beban compound dan interval denyut jantung tinggi (HIIT) untuk membakar kalori maksimal, memicu efek afterburn (EPOC), serta mempertahankan definisi massa otot.',
    bannerImage: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80',
    scheduleDay: 'Senin, Selasa, Kamis, Sabtu (Sesi Latihan 45-50 Menit)',
    benefits: [
      'Memaksimalkan pembakaran kalori harian dan lemak membandel',
      'Meningkatkan daya tahan kardiovaskular dan stamina tubuh',
      'Mencegah penyusutan massa otot saat program defisit kalori',
      'Waktu istirahat efisien menjaga denyut nadi di zona pembakaran lemak'
    ],
    exercises: [
      {
        id: 'ex-11',
        name: 'Kettlebell Russian Swing',
        targetMuscle: 'Glutes, Hamstrings, Core, Bahu',
        equipment: 'Kettlebell (8kg - 16kg)',
        setsReps: '4 Set x 15-20 Repetisi',
        restTime: '45 - 60 Detik',
        difficulty: 'Pemula',
        imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
        instructions: [
          'Berdiri dengan kaki sedikit lebih lebar dari bahu, posisikan kettlebell di lantai sekitar 30 cm di depan Anda.',
          'Bungkukkan pinggul (hip hinge) dan raih gagang kettlebell dengan kedua tangan.',
          'Tarik kettlebell ke belakang di antara kedua paha seperti operan bola rugby.',
          'Dorong pinggul Anda ke depan dengan ledakan tenaga dari otot pantat (glutes) untuk mengayunkan kettlebell ke depan setinggi dada.',
          'Biarkan kettlebell berayun turun kembali di antara paha dan ulangi secara ritmis dan mengalir.'
        ],
        tips: [
          'Kekuatan ayunan berasal 100% dari dorongan engsel pinggul, bukan ditarik dengan otot lengan atau bahu.',
          'Pertahankan tulang belakang selalu lurus dan tatapan mata ke depan.'
        ],
        commonMistakes: [
          'Melakukan gerakan squat alih-alih hip hinge',
          'Mengangkat kettlebell dengan kekuatan tangan'
        ]
      },
      {
        id: 'ex-12',
        name: 'Dumbbell Walking Lunges',
        targetMuscle: 'Quadriceps, Glutes, Betis, Keseimbangan',
        equipment: 'Sepasang Dumbbell Ringan/Sedang',
        setsReps: '3 Set x 12 Langkah per Kaki',
        restTime: '60 Detik',
        difficulty: 'Pemula',
        imageUrl: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?auto=format&fit=crop&w=800&q=80',
        instructions: [
          'Berdiri tegak dengan memegang dumbbell di samping tubuh dengan posisi lengan lurus.',
          'Ambil langkah panjang ke depan dengan kaki kanan, lalu turunkan pinggul Anda ke bawah.',
          'Tekuk kedua lutut hingga sudut 90 derajat; lutut depan tidak melewati ujung jari kaki dan lutut belakang hampir menyentuh lantai.',
          'Dorong tumit kaki depan untuk melangkah maju dengan kaki kiri ke langkah lunge berikutnya.',
          'Lanjutkan berjalan secara bergantian dengan tubuh tetap tegak stabil.'
        ],
        tips: [
          'Jangan biarkan badan condong membungkuk ke depan; pertahankan dada tetap terbuka dan pandangan fokus lurus.',
          'Langkah jangan terlalu sempit agar lutut tidak tertekan berlebihan.'
        ],
        commonMistakes: [
          'Lutut depan menghantam atau membentur ke dalam saat mendarat',
          'Lutut belakang menghantam lantai terlalu keras'
        ]
      },
      {
        id: 'ex-13',
        name: 'Mountain Climbers (Core Cardio)',
        targetMuscle: 'Abdominals, Bahu, Kardiovaskular',
        equipment: 'Matras Gym',
        setsReps: '4 Set x 30-40 Detik',
        restTime: '30 Detik',
        difficulty: 'Pemula',
        imageUrl: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?auto=format&fit=crop&w=800&q=80',
        instructions: [
          'Mulai dari posisi push-up standar (high plank) dengan tangan diletakkan di bawah bahu dan kaki lurus ke belakang.',
          'Kencangkan perut, lalu tarik lutut kanan secepatnya ke arah dada sedekat mungkin tanpa menyentuh lantai.',
          'Kembalikan kaki kanan ke posisi semula dan segera tarik lutut kiri ke arah dada.',
          'Lakukan pergantian kaki secara cepat dan dinamis layaknya sedang berlari mendaki bukit.'
        ],
        tips: [
          'Usahakan pinggul tetap rendah dan sejajar dengan bahu, jangan membiarkan pantat mencuat tinggi ke atas.',
          'Pertahankan ritme pernapasan yang stabil dan tangan menekan lantai dengan kokoh.'
        ],
        commonMistakes: [
          'Pinggul memantul naik-turun terlalu tinggi',
          'Tangan bergeser menjauhi posisi garis bahu'
        ]
      },
      {
        id: 'ex-14',
        name: 'Dumbbell Thruster (Squat to Overhead Press)',
        targetMuscle: 'Seluruh Tubuh: Kaki, Bahu, Core, Jantung',
        equipment: 'Sepasang Dumbbell',
        setsReps: '3 Set x 12 Repetisi',
        restTime: '60 Detik',
        difficulty: 'Menengah',
        imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
        instructions: [
          'Berdiri memegang dumbbell setinggi bahu dengan posisi telapak tangan saling berhadapan (neutral grip).',
          'Lakukan squat penuh ke bawah hingga paha sejajar lantai dengan dada tegak.',
          'Dorong tubuh naik kembali ke atas dengan kuat dan gunakan momentum dorongan kaki untuk langsung menekan dumbbell lurus ke atas kepala.',
          'Kunci posisi di atas sejenak, lalu turunkan dumbbell kembali ke bahu sambil mulai melakukan squat berikutnya dalam satu gerakan mulus berkesinambungan.'
        ],
        tips: [
          'Manfaatkan daya dorong kaki (hip drive) untuk membantu mengangkat dumbbell ke atas kepala.',
          'Gerakan ini sangat menguras energi, pilih beban dumbbell yang proporsional.'
        ],
        commonMistakes: [
          'Memisahkan gerakan menjadi squat dulu lalu berhenti baru mendorong bahu',
          'Menekuk punggung saat berada di posisi squat bawah'
        ]
      }
    ]
  },
  {
    id: 'prog-4',
    title: 'Program Kekuatan Maksimal: Power 5x5 (Strength Focus)',
    category: 'Kekuatan (Strength)',
    level: 'Lanjutan',
    durationWeeks: 10,
    daysPerWeek: 3,
    description: 'Program klasik berbasis compound barbell lift dengan intensitas tinggi (5 set x 5 repetisi). Berfokus murni pada peningkatan kekuatan absolut (1 Rep Max), kepadatan tulang, dan efisiensi rekrutmen serat saraf motorik.',
    bannerImage: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=1200&q=80',
    scheduleDay: 'Senin, Rabu, Jumat (Hari selang istirahat total untuk regenerasi saraf)',
    benefits: [
      'Peningkatan daya angkat beban maksimal secara konsisten (progressive overload)',
      'Memperkuat ligamen, tendon, serta kepadatan tulang sendi',
      'Merangsang pelepasan hormon anabolik alami tubuh',
      'Dasar terbaik untuk cabang olahraga atletik dan powerlifting'
    ],
    exercises: [
      {
        id: 'ex-15',
        name: 'Barbell Back Squat (Low/High Bar)',
        targetMuscle: 'Quadriceps, Glutes, Hamstrings, Spinal Erectors',
        equipment: 'Squat Rack & Olympic Barbell',
        setsReps: '5 Set x 5 Repetisi',
        restTime: '2 - 3 Menit',
        difficulty: 'Lanjutan',
        imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=800&q=80',
        instructions: [
          'Posisikan barbell di squat rack setinggi dada atas. Masuk ke bawah palang dan letakkan barbell kokoh di atas otot trapezius (bukan menekan tulang leher).',
          'Genggam palang erat, angkat beban dari rak, lalu mundur 2 langkah kecil ke belakang.',
          'Buka kaki selebar bahu, ambil napas dalam ke perut (manuver Valsalva) untuk menciptakan tekanan intra-abdominal yang melindungi pinggang.',
          'Tekuk lutut dan pinggul secara sinkron, turunkan tubuh hingga lipatan pinggul berada sedikit di bawah tempurung lutut (full depth).',
          'Dorong lantai dengan seluruh telapak kaki untuk bangkit kembali ke posisi berdiri tegak lalu hembuskan napas di puncak.'
        ],
        tips: [
          'Wajib menggunakan safety pin rack saat mencoba beban 5x5 yang menantang.',
          'Istirahat penuh minimal 2-3 menit antar set agar energi ATP dan sistem saraf pusat pulih.'
        ],
        commonMistakes: [
          'Kedalaman squat setengah-setengah (half squat)',
          'Lutut roboh ke dalam saat mendorong beban naik'
        ]
      },
      {
        id: 'ex-16',
        name: 'Barbell Conventional Deadlift',
        targetMuscle: 'Posterior Chain: Erector Spinae, Glutes, Hamstrings, Lats, Trap',
        equipment: 'Olympic Barbell & Bumper Plates di Lantai',
        setsReps: '5 Set x 5 Repetisi',
        restTime: '2 - 3 Menit',
        difficulty: 'Lanjutan',
        imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
        instructions: [
          'Berdiri dengan kaki selebar pinggul di mana palang barbell memotong tepat di tengah-tengah telapak kaki (sekitar 2.5 cm dari tulang kering).',
          'Dorong pinggul ke belakang dan genggam palang tepat di luar garis kaki Anda.',
          'Tarik tulang kering maju hingga menyentuh palang, busungkan dada ke depan dan kencangkan otot latissimus dorsi (kunci ketiak seperti memeras jeruk).',
          'Tarik napas perut yang dalam, lalu angkat beban dengan mendorong lantai menjauh menggunakan kaki sambil meluruskan pinggul dan lutut bersamaan.',
          'Kunci posisi berdiri tegap (tanpa melengkungkan pinggang ke belakang secara berlebihan), lalu kembalikan barbell ke lantai secara terkontrol.'
        ],
        tips: [
          'Palang barbell harus terus menempel atau menyusuri tulang kering dan paha sepanjang lintasan angkat.',
          'Jangan pernah mengangkat dengan punggung membungkuk.'
        ],
        commonMistakes: [
          'Menghentakkan barbell secara mendadak tanpa menegangkan tubuh terlebih dahulu (slack pull)',
          'Mencondongkan pinggang terlalu ke belakang saat posisi lockout'
        ]
      },
      {
        id: 'ex-17',
        name: 'Standing Barbell Overhead Military Press',
        targetMuscle: 'Bahu (Anterior & Medial Deltoid), Triceps, Core',
        equipment: 'Olympic Barbell & Rack',
        setsReps: '5 Set x 5 Repetisi',
        restTime: '2 - 3 Menit',
        difficulty: 'Lanjutan',
        imageUrl: 'https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?auto=format&fit=crop&w=800&q=80',
        instructions: [
          'Ambil barbell dari rak setinggi tulang dada, genggam palang tepat di luar lebar bahu dengan pergelangan tangan lurus.',
          'Berdiri tegak dengan kaki selebar bahu, kencangkan otot paha depan, glutes, dan otot perut sekencang mungkin.',
          'Miringkan kepala sedikit ke belakang agar palang dapat melintas tanpa mengenai dagu.',
          'Dorong barbell lurus vertikal ke atas kepala hingga kedua lengan mengunci penuh di atas kepala.',
          'Begitu palang melewati dahi, kembalikan posisi kepala ke posisi netral dan sejajarkan palang dengan bagian tengah kaki Anda.'
        ],
        tips: [
          'Gerakan ini murni kekuatan tubuh bagian atas; dilarang menekuk lutut untuk membantu dorongan (itu gerakan push press).',
          'Kekencangan bokong dan perut adalah kunci menjaga tulang punggung tetap aman.'
        ],
        commonMistakes: [
          'Membengkokkan pinggang ke belakang untuk meniru posisi incline press',
          'Siku terlalu melebar ke belakang sebelum mendorong'
        ]
      }
    ]
  }
];
