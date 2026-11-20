import bcrypt from 'bcryptjs';
import { connectDB, disconnectDB } from '../config/db.js';
import { User } from '../models/User.js';
import { Book } from '../models/Book.js';
import { Character } from '../models/Character.js';
import { JournalPost } from '../models/JournalPost.js';
import { ReaderLetter } from '../models/ReaderLetter.js';
import { Testimonial } from '../models/Testimonial.js';
import { Event } from '../models/Event.js';
import { SiteSettings } from '../models/SiteSettings.js';

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log('Clearing existing records for fresh seed...');

    await Promise.all([
      User.deleteMany({}),
      Book.deleteMany({}),
      Character.deleteMany({}),
      JournalPost.deleteMany({}),
      ReaderLetter.deleteMany({}),
      Testimonial.deleteMany({}),
      Event.deleteMany({}),
      SiteSettings.deleteMany({})
    ]);

    console.log('Seeding author administrator...');
    const passwordHash = await bcrypt.hash('AuthorJaya2026!', 10);
    const author = await User.create({
      name: 'Ms. Jaya Roy Chowdhury',
      email: 'admin@inkandiris.com',
      passwordHash,
      role: 'author',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600'
    });

    console.log('Seeding books...');
    const book1 = await Book.create({
      title: 'The Memory of Rain',
      slug: 'the-memory-of-rain',
      subtitle: 'A Novel of Monsoon and Inheritance',
      coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800',
      galleryImages: [
        'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&q=80&w=800'
      ],
      synopsis: 'Set against the relentless downpours of monsoon Kolkata and the pine-scented mist of Kalimpong, The Memory of Rain follows Ananya Sen as she returns to her ancestral estate to catalog her grandfather’s waterlogged library. Hidden between the brittle pages of botanical manuscripts, she unearths a series of unsent letters that unravel forty years of silence between two families separated by the Partition of Bengal.',
      genre: 'Literary Fiction / Historical Drama',
      themes: ['Monsoon Memory', 'Inheritance', 'Colonial Legacies', 'Botanical Symbolism', 'Exile'],
      publicationDate: new Date('2023-09-14'),
      publisher: 'Quill & Heritage Imprint',
      isbn: '978-0-143-45892-1',
      pageCount: 384,
      status: 'published',
      featured: true,
      authorNotes: 'I wrote the second chapter during an eight-day cloudburst in Kurseong. The smell of wet earth and cedar wood seeped so deeply into my notebook that the ink ran across four pages. Rain in Bengal is never merely weather; it is an archivist that resurrects what the heart attempts to bury.',
      purchaseLinks: [
        { store: 'Bookshop.org (Independent Booksellers)', url: 'https://bookshop.org' },
        { store: 'Amazon Worldwide', url: 'https://amazon.com' },
        { store: 'Oxford Bookstore Kolkata', url: 'https://oxfordbookstore.com' }
      ],
      excerpts: [
        {
          title: 'Opening Movement: The Architecture of Downpour',
          text: 'In North Kolkata, rain does not arrive as an event; it resumes. It remembers the limestone balustrades, the mildewed cornices of nineteenth-century courtyards, and the exact groove where the tram lines curve towards Shyambazar. When Ananya pushed open the shutters of the second-floor library, the smell of damp jute and dust rose like an apology. Forty-two summers had passed since anyone had turned the brass key in this lock.'
        },
        {
          title: 'The Botanical Manuscript',
          text: 'Her fingers traced the copperplate inscription on the leather binder: "Ferns of the Teesta Valley, 1946." But tucked between the fronds of dried maidenhair was a single envelope, unsealed, addressed to a name that had never been spoken at dinner: Meera.'
        }
      ]
    });

    const book2 = await Book.create({
      title: 'Whispers Across the Hooghly',
      slug: 'whispers-across-the-hooghly',
      subtitle: 'Rivers, Shadows, and the Cost of Survival',
      coverImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=800',
      galleryImages: [
        'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=800'
      ],
      synopsis: 'A gripping dual-timeline narrative spanning 1942 wartime Calcutta and present-day London. When maritime conservator Devrat Banerjee is commissioned to restore a sunken barge on the Hooghly river, he discovers clandestine trade manifests belonging to Maya Mukherjee—a fiercely independent woman who ran a covert intelligence and printing press during the Quit India movement.',
      genre: 'Historical Fiction / Mystery',
      themes: ['Wartime Calcutta', 'River Geography', 'Female Agency', 'Clandestine Press', 'Restoration'],
      publicationDate: new Date('2021-11-05'),
      publisher: 'Quill & Heritage Imprint',
      isbn: '978-0-143-42110-9',
      pageCount: 448,
      status: 'published',
      featured: true,
      authorNotes: 'The Hooghly is a living character. It carries silt, coal, corpses, secrets, and song. Spending weeks with the boatmen at Princep Ghat taught me that rivers have memory far more durable than stone.',
      purchaseLinks: [
        { store: 'Bookshop.org', url: 'https://bookshop.org' },
        { store: 'Amazon', url: 'https://amazon.com' }
      ],
      excerpts: [
        {
          title: 'Chapter I: The Silt of 1942',
          text: 'The river was the color of tarnished pewter. In the twilight before the blackout sirens wailed, Maya leaned over the gunwale of the dinghy, her fingers pressing into the bundle of cyclostyled pamphlets concealed beneath bundles of mustard greens. One slip of the current, and the printers at College Street would be undone.'
        }
      ]
    });

    const book3 = await Book.create({
      title: 'Before the Jacarandas Fall',
      slug: 'before-the-jacarandas-fall',
      subtitle: 'A Novella of Exile and Return',
      coverImage: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=800',
      galleryImages: [],
      synopsis: 'A lyrical, intimate novella exploring the quiet unraveling and tender reconciliation of an estranged botanist and his daughter in a crumbling hill-station cottage. As the purple jacaranda blossoms carpet the brick lanes of Dehradun, they confront the truth of what was abandoned in the pursuit of art.',
      genre: 'Lyrical Novella',
      themes: ['Artistic Devotion', 'Parental Estrangement', 'Hill Stations', 'Jacaranda Season'],
      publicationDate: new Date('2027-04-15'),
      publisher: 'Quill & Heritage Imprint',
      pageCount: 192,
      status: 'coming_soon',
      featured: false,
      authorNotes: 'Currently in final manuscript revisions. This story belongs to the quiet hours between tea and dusk, when the light shifts from gold to blue.',
      purchaseLinks: [
        { store: 'Pre-order via Publisher', url: '#' }
      ],
      excerpts: [
        {
          title: 'Opening Lines',
          text: 'When the jacarandas bloom, the hill station pretends it has never known grief. For three weeks every spring, the town is bathed in violet, soft and indifferent to the mortality of those walking underneath.'
        }
      ]
    });

    console.log('Seeding characters...');
    const char1 = await Character.create({
      name: 'Ananya Sen',
      slug: 'ananya-sen',
      portraitUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
      archetype: 'The Contemplative Archivist',
      book: book1._id,
      background: 'Trained as an archivist and paper conservator in Edinburgh, Ananya returned to Kolkata upon her grandfather’s death, expecting only property disputes and moldering journals. Instead, she became the guardian of an unspoken dynasty.',
      personalityTraits: ['Methodical', 'Perceptive', 'Guarded', 'Sensory-attuned'],
      motivations: 'To reconstruct the emotional truth of her family before the physical remnants decompose.',
      memorableQuotes: [
        'Paper has a pulse; it shrinks in winter, breathes with humidity, and remembers every thumbprint that ever held it with love.',
        'We spend our lives building cabinets for our grief, forgetting that dust settles equally on cedar and pine.'
      ],
      featured: true
    });

    const char2 = await Character.create({
      name: 'Devrat Banerjee',
      slug: 'devrat-banerjee',
      portraitUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600',
      archetype: 'The River Conservator',
      book: book2._id,
      background: 'A maritime archaeologist with quiet determination, Devrat has spent twenty years excavating timber wrecks and river beds along the Ganges delta. His obsession with sunken wood mirrors his inability to let go of his own lost heritage.',
      personalityTraits: ['Taciturn', 'Steadfast', 'Deeply reflective', 'Patient'],
      motivations: 'To pull forgotten voices up from the river mud before modernity washes them into the Bay of Bengal.',
      memorableQuotes: [
        'Stone can be engraved with lies, but wood preserves the salt and current of what truly happened.',
        'The river does not judge the weight of what it drowns.'
      ],
      featured: true
    });

    const char3 = await Character.create({
      name: 'Maya Mukherjee',
      slug: 'maya-mukherjee',
      portraitUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600',
      archetype: 'The Clandestine Chronicler',
      book: book2._id,
      background: 'Operating from a hidden press behind a bookbinder’s shop on College Street during the 1942 movement, Maya distributed radical literature while maintaining the veneer of a quiet music teacher.',
      personalityTraits: ['Fierce', 'Unyielding', 'Intellectual', 'Self-sacrificing'],
      motivations: 'To forge words so potent that foreign censors could never silence them.',
      memorableQuotes: [
        'They can confiscate the lead type, but they cannot confiscate the rhythm of our breath.',
        'Courage is simply love that has run out of patience.'
      ],
      featured: true
    });

    const char4 = await Character.create({
      name: 'Robin Stewart',
      slug: 'robin-stewart',
      portraitUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600',
      archetype: 'The Disillusioned Naturalist',
      book: book1._id,
      background: 'Grandson of the British botanist who co-authored the 1946 Himalayan botanical records, Robin travels to Kalimpong searching for the missing botanical plates, only to find Ananya already there.',
      personalityTraits: ['Observant', 'Melancholic', 'Earnest', 'Cultivated'],
      motivations: 'To confront his family’s colonial complicity and find personal peace.',
      memorableQuotes: [
        'We collected names for flowers that already had songs sung to them for a thousand years.'
      ],
      featured: false
    });

    console.log('Linking character relationships...');
    char1.relationships = [
      {
        relatedCharacter: char4._id,
        relationType: 'Uneasy Collaborator & Confidante',
        notes: 'Bound together by the deciphering of grandfather’s letters and the rain-swept library.'
      }
    ];
    await char1.save();

    char2.relationships = [
      {
        relatedCharacter: char3._id,
        relationType: 'Historical Muse & Ancestral Obsession',
        notes: 'Devrat pieces together Maya’s life across an eighty-year temporal chasm.'
      }
    ];
    await char2.save();

    // Link characters to books
    book1.associatedCharacters = [char1._id, char4._id];
    await book1.save();

    book2.associatedCharacters = [char2._id, char3._id];
    await book2.save();

    console.log('Seeding Ink Journal posts...');
    await JournalPost.create([
      {
        title: 'On the Geometry of Rain: Writing in the Shadow of the Monsoon',
        slug: 'on-the-geometry-of-rain',
        excerpt: 'Why the monsoon in Bengal is not an atmosphere, but a cadence that dictates how sentences are constructed.',
        content: `
# On the Geometry of Rain

In the European tradition, rain is often treated as pathetic fallacy—a convenient theatrical mirror for despair, weeping skies for broken vows. But in Eastern India, monsoon does not merely reflect mood; it dictates syntax.

When a cloudburst breaks over the galvanized tin roofs of the hills, normal conversation ceases. You cannot whisper; you cannot speak in balanced eighteenth-century clauses. You either speak in shouts, or you fall into a silence that lasts for days. 

### The Parchment and the Mold

When I began writing *The Memory of Rain*, my desk was placed next to a high arched window in an old family house in Kalimpong. The humidity was such that the paper of my notebook swelled by twenty percent. To touch the page was to feel the living vapor of the valley. 

Every author has an element that belongs to their marrow. For Virginia Woolf, it was the sea; for Marquez, the yellow dust of the banana plantations. For me, it has always been water: water trapped in limestone, water rising in the river, water that erases borders and makes strangers sit together under the same awning waiting for the tram.

> "A sentence written in rain must have room inside it for the sound of thunder."

When you read these pages, do not rush. Allow the wet earth to rise from the font.
        `,
        featuredImage: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&q=80&w=800',
        category: 'On Writing',
        tags: ['Monsoon', 'Writing Craft', 'Kalimpong', 'Memory'],
        readingTimeMinutes: 5,
        status: 'published',
        publishedAt: new Date('2024-02-10'),
        relatedBooks: [book1._id],
        views: 342
      },
      {
        title: 'The Cartography of Loss: How Characters Refuse Their Creators',
        slug: 'the-cartography-of-loss',
        excerpt: 'Reflections on the moment when a fictional figure breaks away from the outline and demands their own truth.',
        content: `
# The Cartography of Loss

Every novelist begins with an illusion of sovereign authority. We prepare index cards; we sketch genealogical trees; we decide with imperial confidence who will marry, who will fall ill, and who will board the midnight mail train at Howrah Station.

And then, somewhere around page eighty, the rebellion begins.

### When Maya Mukherjee Refused to Die

In my initial draft of *Whispers Across the Hooghly*, Maya was conceived as a tragic victim of the 1942 police crackdown. She was supposed to perish quietly in a cell at Alipore. I had already written the mourning sequence for her brother.

But on a Tuesday morning in October, as I sat at the typewriter, Maya simply refused to be captured. She turned down an alley behind the Marble Palace, stepped into a river barge, and pulled the oilskin tarp over herself. She had survived, and she looked up at me from the manuscript as if to say: *You may have invented my name, but you do not own my survival.*

This is the great humbling joy of the novel. We are not gods; we are merely medium-dry sponges soaking up the living spirit of the people who come to live in our rooms.
        `,
        featuredImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=800',
        category: 'Essays',
        tags: ['Character Craft', 'Novels', 'Process', 'Hooghly'],
        readingTimeMinutes: 7,
        status: 'published',
        publishedAt: new Date('2024-05-18'),
        relatedBooks: [book2._id],
        views: 519
      },
      {
        title: 'In Praise of Solitary Libraries',
        slug: 'in-praise-of-solitary-libraries',
        excerpt: 'A meditation on reading rooms, silence, dust jackets, and the companionship of long-dead authors.',
        content: `
# In Praise of Solitary Libraries

There is a particular acoustic resonance found only in libraries with ceilings higher than fifteen feet. Sound does not echo; it settles into the spines of calfskin folios and clothbound memoirs.

As a child, my grandfather’s library was both sanctuary and courtroom. There, one could not speak loudly, not because of authoritarian prohibition, but because loudness in the presence of so many listening minds felt like a failure of manners.

In an age of endless digital notification, a physical library is an act of spiritual defiance. It asks of you only one thing: your unbroken attention.
        `,
        featuredImage: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=800',
        category: 'Reflections',
        tags: ['Libraries', 'Reading Culture', 'Solitude'],
        readingTimeMinutes: 4,
        status: 'published',
        publishedAt: new Date('2024-08-02'),
        relatedBooks: [book1._id],
        views: 284
      },
      {
        title: 'Behind the Quill: The Notebooks for Jacaranda',
        slug: 'behind-the-quill-jacaranda',
        excerpt: 'A glimpse into the working journals, botanical sketches, and fragments that are shaping the upcoming novella.',
        content: `
# Behind the Quill: The Notebooks for Jacaranda

Before a novel has words, it has colors. 

For *Before the Jacarandas Fall*, the color arrived long before the plot. It was a precise violet-lavender, the tint of jacaranda petals bruised by afternoon tires on the old Rajpur road. 

I carry three notebooks when preparing a work of this density: one for overheard cadences of dialogue, one for botanical nomenclature, and one for the emotional weather of the chapters. Here, I share a small preview of the working fragments...
        `,
        featuredImage: 'https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?auto=format&fit=crop&q=80&w=800',
        category: 'Behind the Quill',
        tags: ['Drafts', 'Notebooks', 'Upcoming', 'Jacaranda'],
        readingTimeMinutes: 6,
        status: 'draft',
        publishedAt: new Date('2024-10-01'),
        relatedBooks: [book3._id],
        views: 45
      }
    ]);

    console.log('Seeding reader correspondence...');
    await ReaderLetter.create([
      {
        senderName: 'Sreemoyi Sen Gupta',
        senderEmail: 'sreemoyi.sg@gmail.com',
        isAnonymous: false,
        bookReferenced: book1._id,
        subject: 'My grandmother’s library in Darjeeling',
        message: 'Dear Ms. Roy Chowdhury, Reading Ananya’s discovery of the unsealed letters in The Memory of Rain felt like someone had opened the attic of my own childhood home in Darjeeling. My grandmother had a similar teak cabinet that smelled of camphor and dried camellia leaves. Thank you for giving dignity to our quiet domestic archives.',
        consentToPublish: true,
        status: 'approved',
        featured: true,
        authorReply: 'Dearest Sreemoyi, Your letter brought tears to my eyes. Teak and camphor are the true keepers of Indian memories. Give my reverence to the mountains in Darjeeling—they remember everything we forget.',
        repliedAt: new Date('2024-03-12')
      },
      {
        senderName: 'A Reader from Oxford',
        senderEmail: 'nicholas.vane@bodleian.ox.ac.uk',
        isAnonymous: true,
        bookReferenced: book2._id,
        subject: 'The maritime trade records in Whispers',
        message: 'I was astounded by the historical fidelity of the 1942 river manifests in Whispers Across the Hooghly. The balance between meticulous archival precision and devastating emotional weight is extraordinarily rare.',
        consentToPublish: true,
        status: 'approved',
        featured: true,
        authorReply: 'Thank you for your generous note. Spending months in the Bengal Maritime archives was grueling, but honoring the uncelebrated rivermen made every dusty ledger worth opening.',
        repliedAt: new Date('2024-04-05')
      },
      {
        senderName: 'Priyanka Ghosh',
        senderEmail: 'p.ghosh22@yahoo.com',
        isAnonymous: false,
        bookReferenced: book1._id,
        subject: 'Question on Chapter 9: The botanical plate',
        message: 'Did the species of fern mentioned in the grandfather’s diary actually exist in 1946, or was it a literary invention for the emotional metaphor?',
        consentToPublish: true,
        status: 'pending',
        featured: false
      },
      {
        senderName: 'Anonymous Student',
        senderEmail: 'student.lit@jadavpur.edu',
        isAnonymous: true,
        subject: 'A personal note of gratitude for your prose',
        message: 'I am writing my masters dissertation on water metaphors in post-independence South Asian literature. Your work has been the anchor of my thesis.',
        consentToPublish: false,
        status: 'private',
        featured: false
      }
    ]);

    console.log('Seeding literary praise and testimonials...');
    await Testimonial.create([
      {
        quote: 'Jaya Roy Chowdhury writes with an archival tenderness that is breathtaking. In her hands, history does not gather dust; it bleeds, breathes, and demands our reckonings.',
        attribution: 'The Bengal Literary Review',
        source: 'Publication',
        bookReferenced: book1._id,
        featured: true
      },
      {
        quote: 'A master of atmospheric prose. The Memory of Rain is one of the finest Indian novels of the decade.',
        attribution: 'Amitav Ghosh',
        source: 'Author',
        bookReferenced: book1._id,
        featured: true
      },
      {
        quote: 'Whispers Across the Hooghly reclaims the lost women of 1942 with fierce intelligence and unforgettable grace.',
        attribution: 'The Statesman Cultural Supplement',
        source: 'Critic',
        bookReferenced: book2._id,
        featured: true
      },
      {
        quote: 'Her sentences have the cadence of falling water and the permanence of old brass.',
        attribution: 'Kavita Das, Reader in Kolkata',
        source: 'Reader',
        featured: false
      }
    ]);

    console.log('Seeding gatherings and appearances...');
    await Event.create([
      {
        title: 'Keynote & In-Conversation: The Memory of Water',
        eventType: 'Literary Festival',
        date: new Date('2026-12-14T15:30:00Z'),
        timeString: '3:30 PM – 5:00 PM IST',
        venue: 'Mughal Tent, Diggi Palace',
        location: 'Jaipur Literature Festival, Rajasthan',
        isVirtual: false,
        description: 'Ms. Jaya Roy Chowdhury speaks on ancestral inheritance, archival fiction, and her celebrated novel The Memory of Rain, followed by audience Q&A and book signing.',
        registrationUrl: 'https://jaipurliteraturefestival.org',
        status: 'upcoming',
        featured: true
      },
      {
        title: 'Evening Reading & Book Signing',
        eventType: 'Reading',
        date: new Date('2027-01-22T18:00:00Z'),
        timeString: '6:00 PM – 8:00 PM IST',
        venue: 'Oxford Bookstore, Park Street',
        location: 'Kolkata, West Bengal',
        isVirtual: false,
        description: 'An intimate candlelit reading from Whispers Across the Hooghly, followed by conversation on Kolkata’s hidden wartime press history with historian Sugata Bose.',
        registrationUrl: 'https://oxfordbookstore.com',
        status: 'upcoming',
        featured: true
      },
      {
        title: 'International Masterclass: Crafting Historical Depth in Fiction',
        eventType: 'Interview',
        date: new Date('2027-02-18T14:00:00Z'),
        timeString: '2:00 PM – 3:30 PM GMT',
        venue: 'British Centre for Literary Translation (Virtual)',
        location: 'Online / Norwich, UK',
        isVirtual: true,
        virtualLink: 'https://zoom.us/j/sample-bclt-link',
        description: 'A global digital workshop exploring archival research, primary source integration, and voice modulation for contemporary literary novelists.',
        registrationUrl: 'https://bclt.org.uk',
        status: 'upcoming',
        featured: false
      },
      {
        title: 'Panel: Partition and the Living River',
        eventType: 'Literary Festival',
        date: new Date('2024-01-18T11:00:00Z'),
        timeString: '11:00 AM IST',
        venue: 'Victoria Memorial Gardens',
        location: 'Kolkata Literary Meet',
        isVirtual: false,
        description: 'Discussing the psychological borders and riverine commerce of Bengal with fellow regional novelists.',
        status: 'past',
        featured: false
      }
    ]);

    console.log('Seeding site settings and Daily Fragment...');
    await SiteSettings.create({
      dailyFragment: {
        quote: 'Memory is an ink that deepens with every season of rain, staining the paper until the silence speaks.',
        workTitle: 'The Memory of Rain',
        commentary: 'From Chapter IV, as Ananya returns to her grandfather’s library in Kalimpong.',
        dateString: 'Fragment of the Day'
      },
      heroTitle: 'Where stories take root, characters breathe, and every reader finds a little piece of themselves.',
      heroSubtitle: 'The Digital Literary Universe of Ms. Jaya Roy Chowdhury',
      heroIntro: 'Step across the threshold of contemporary literary heritage. Explore evocative novels, intimate character archives, reader letters, and meditative essays on craft.',
      authorBioSummary: 'Ms. Jaya Roy Chowdhury is an acclaimed novelist, essayist, and chronicler of human longing, historical resonance, and the hidden geographies of Bengal. Her novels have been translated into twelve languages and celebrated for their poetic precision and deep psychological resonance.',
      authorPhilosophy: 'Where stories take root, characters breathe, and every reader finds a little piece of themselves.',
      socialLinks: {
        instagram: 'https://instagram.com/jayaroychowdhury',
        twitter: 'https://twitter.com/jayaroyc',
        goodreads: 'https://goodreads.com/author/jaya_roy_chowdhury',
        substack: 'https://inkandiris.substack.com'
      },
      literaryAgent: {
        name: 'Devina Khurana',
        agency: 'Heritage & Quill Literary Agency',
        email: 'rights@heritagequill.com'
      },
      pressKitUrl: '/press-kit.pdf',
      readingGuides: [
        {
          title: 'The Memory of Rain — Book Club & Reading Guide',
          description: 'A curated 12-page discussion guide featuring character maps, discussion questions on memory and inheritance, and archival notes.',
          fileUrl: '/guides/memory-of-rain-guide.pdf',
          bookTitle: 'The Memory of Rain'
        },
        {
          title: 'Rivers & Rebellion: Historical Companion to Hooghly',
          description: 'Historical context, maps of wartime Calcutta in 1942, and an interview with the author on maritime archaeology.',
          fileUrl: '/guides/hooghly-companion.pdf',
          bookTitle: 'Whispers Across the Hooghly'
        }
      ]
    });

    console.log('\n======================================================');
    console.log('✦ INK & IRIS DATABASE SEEDED SUCCESSFULLY ✦');
    console.log('Author Admin Login: admin@inkandiris.com');
    console.log('Author Password:    AuthorJaya2026!');
    console.log('======================================================\n');
  } catch (err) {
    console.error('Error during seeding:', err);
  } finally {
    await disconnectDB();
  }
};

seedDatabase();
