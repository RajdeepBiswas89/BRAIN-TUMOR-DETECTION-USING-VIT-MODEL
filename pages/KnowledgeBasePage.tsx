
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Youtube, 
  ExternalLink, 
  BookOpen, 
  Brain, 
  Stethoscope, 
  Activity,
  ArrowRight,
  MapPin,
  Dna,
  Scan,
  FileText
} from 'lucide-react';

interface ResearchPaper {
  title: string;
  url: string;
}

interface TumorInfo {
  title: string;
  type: string;
  grade: string;
  description: string;
  origin: string;
  locations: string[];
  imagingFeatures: string[];
  symptoms: string[];
  color: string;
  youtubeUrl: string;
  imageUrl: string;
  researchPapers: ResearchPaper[];
}

const tumorData: TumorInfo[] = [
  {
    title: 'Glioma',
    type: 'Intra-axial',
    grade: 'Grade II-IV',
    description: 'A common type of tumor originating in the glial cells that surround and support neurons. Glioblastoma Multiforme (GBM) is the most aggressive form.',
    origin: 'Derived from glial progenitor cells or differentiated glial cells, including astrocytes (astrocytomas), oligodendrocytes (oligodendrogliomas), and ependymal cells (ependymomas).',
    locations: ['Frontal Lobe (Cognitive)', 'Temporal Lobe (Memory)', 'Brainstem (Autonomic)', 'Cerebellum (Motor)'],
    imagingFeatures: [
      'T2/FLAIR hyperintensity indicating tumor infiltration',
      'Heterogeneous contrast enhancement in high-grade cases',
      'Mass effect with midline shift',
      'Extensive vasogenic edema'
    ],
    symptoms: ['Headaches', 'Seizures', 'Cognitive decline', 'Vision changes'],
    color: '#4361EE',
    youtubeUrl: 'https://www.youtube.com/results?search_query=glioma+mri+pathology',
    imageUrl: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=800&h=600',
    researchPapers: [
      { title: 'Glioblastoma: Pathology and Management', url: 'https://pubmed.ncbi.nlm.nih.gov/24508470/' },
      { title: 'Molecular Pathogenesis of Gliomas', url: 'https://www.nature.com/articles/nrclinonc.2013.204' }
    ]
  },
  {
    title: 'Meningioma',
    type: 'Extra-axial',
    grade: 'Grade I-III',
    description: 'The most common primary brain tumor, arising from the meninges (the membranes covering the brain). Usually benign and slow-growing.',
    origin: 'Arises from the arachnoid cap cells found in the arachnoid villi, part of the protective meningeal layers.',
    locations: ['Cerebral Convexity', 'Parasagittal Sinus', 'Sphenoid Wing', 'Olfactory Groove', 'Tentorium Cerebelli'],
    imagingFeatures: [
      'Dural tail sign (reactive dural thickening)',
      'Intense, homogeneous contrast enhancement',
      'Well-circumscribed extra-axial margins',
      'CSF cleft sign (separation from brain parenchyma)'
    ],
    symptoms: ['Gradual headaches', 'Weakness', 'Hearing loss', 'Memory problems'],
    color: '#7209B7',
    youtubeUrl: 'https://www.youtube.com/results?search_query=meningioma+surgery+explained',
    imageUrl: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=800&h=600',
    researchPapers: [
      { title: 'Epidemiology of Meningiomas', url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3025255/' },
      { title: 'Meningioma Grading and Histology', url: 'https://pubmed.ncbi.nlm.nih.gov/17571279/' }
    ]
  },
  {
    title: 'Pituitary Adenoma',
    type: 'Sellar Region',
    grade: 'Benign',
    description: 'Tumors of the pituitary gland, often affecting hormone levels. They can cause vision issues by pressing on the optic chiasm.',
    origin: 'Neoplastic proliferation of epithelial cells within the anterior pituitary gland (adenohypophysis).',
    locations: ['Sella Turcica (Intrasellar)', 'Suprasellar Cistern (Extension)', 'Cavernous Sinus (Invasion)'],
    imagingFeatures: [
      'Sellar floor remodeling and enlargement',
      'Compression of the optic chiasm',
      'Figure-eight or "Snowman" appearance (suprasellar extension)',
      'Lateral invasion of cavernous sinuses'
    ],
    symptoms: ['Hormonal imbalance', 'Vision loss (Bitemporal)', 'Nausea', 'Fatigue'],
    color: '#4CC9F0',
    youtubeUrl: 'https://www.youtube.com/results?search_query=pituitary+adenoma+mri',
    imageUrl: 'https://images.unsplash.com/photo-1579154235884-332cfa46132f?auto=format&fit=crop&q=80&w=800&h=600',
    researchPapers: [
      { title: 'Management of Pituitary Adenomas', url: 'https://www.thelancet.com/journals/lanonc/article/PIIS1470-2045(11)70014-X/fulltext' },
      { title: 'Diagnosis of Sellar Masses', url: 'https://pubmed.ncbi.nlm.nih.gov/22002597/' }
    ]
  },
  {
    title: 'Acoustic Neuroma',
    type: 'Vestibular Schwannoma',
    grade: 'Grade I',
    description: 'A benign tumor on the vestibular nerve leading from the inner ear to the brain, affecting hearing and balance.',
    origin: 'Growth of Schwann cells forming the insulating myelin sheath on the vestibular branch of the vestibulocochlear nerve (Cranial Nerve VIII).',
    locations: ['Cerebellopontine Angle (CPA)', 'Internal Auditory Canal (IAC)', 'Porus Acusticus'],
    imagingFeatures: [
      'Classic "Ice cream cone" appearance',
      'Trumpet-shaped widening of the Internal Auditory Canal',
      'Intense enhancement with Gadolinium',
      'Displacement of the brainstem and cerebellum in large masses'
    ],
    symptoms: ['Tinnitus', 'Balance issues', 'Facial numbness', 'Hearing loss'],
    color: '#2A9D8F',
    youtubeUrl: 'https://www.youtube.com/results?search_query=acoustic+neuroma+vestibular+schwannoma',
    imageUrl: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&q=80&w=800&h=600',
    researchPapers: [
      { title: 'Vestibular Schwannoma Pathophysiology', url: 'https://www.nature.com/articles/nrgastro.2011.196' },
      { title: 'Stereotactic Radiosurgery for Neuromas', url: 'https://pubmed.ncbi.nlm.nih.gov/11261386/' }
    ]
  }
];

const KnowledgeBasePage: React.FC = () => {
  return (
    <div className="max-w-[1400px] mx-auto space-y-12 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-4">
             <div className="w-10 h-10 bg-[#2A9D8F]/10 text-[#2A9D8F] rounded-xl flex items-center justify-center">
               <BookOpen size={20} />
             </div>
             <span className="text-[10px] font-black text-[#2A9D8F] uppercase tracking-[0.2em]">Clinical Resources</span>
          </div>
          <h1 className="text-5xl font-black text-[#0A2463] tracking-tight">Oncology Knowledge Base</h1>
          <p className="text-gray-400 mt-4 text-lg max-w-2xl font-medium">Comprehensive clinical directory for brain pathology classification and patient education.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {tumorData.map((tumor, idx) => (
          <motion.div
            key={tumor.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group bg-white rounded-[3rem] overflow-hidden border border-gray-100 shadow-xl shadow-gray-200/40 hover:shadow-2xl hover:border-[#2A9D8F]/20 transition-all flex flex-col"
          >
            <div className="h-72 relative overflow-hidden shrink-0">
              <img src={tumor.imageUrl} alt={tumor.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A2463] to-transparent opacity-70" />
              <div className="absolute bottom-8 left-8">
                <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-xl text-[10px] font-black text-white uppercase tracking-widest border border-white/20 mb-2 inline-block">
                  {tumor.type}
                </span>
                <h3 className="text-4xl font-black text-white">{tumor.title}</h3>
              </div>
            </div>

            <div className="p-10 space-y-10 flex-1 flex flex-col">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity size={16} className="text-[#2A9D8F]" />
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Growth Grade</span>
                  <span className="px-3 py-1 bg-gray-50 text-[#0A2463] rounded-lg text-xs font-bold">{tumor.grade}</span>
                </div>
              </div>

              <div className="space-y-6">
                <p className="text-gray-600 leading-relaxed font-medium text-sm">
                  {tumor.description}
                </p>

                <div className="grid grid-cols-1 gap-6">
                  {/* Origin Section */}
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                      <Dna size={14} className="text-[#2A9D8F]" /> Histological Origin & Tissue Type
                    </h4>
                    <p className="text-sm font-bold text-[#0A2463] bg-gray-50 p-4 rounded-2xl leading-relaxed">
                      {tumor.origin}
                    </p>
                  </div>

                  {/* Anatomical Locations Section */}
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                      <MapPin size={14} className="text-[#4361EE]" /> Common Anatomical Distribution
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {tumor.locations.map(loc => (
                        <span key={loc} className="px-3 py-1.5 bg-blue-50 text-[#4361EE] rounded-xl text-[10px] font-black uppercase tracking-tight border border-blue-100">
                          {loc}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                      <Scan size={14} className="text-[#7209B7]" /> Diagnostic Imaging Markers
                    </h4>
                    <ul className="space-y-2">
                      {tumor.imagingFeatures.map(feat => (
                        <li key={feat} className="flex items-center gap-3 text-xs text-gray-600 font-medium">
                          <div className="w-1 h-1 bg-[#7209B7] rounded-full" />
                          {feat}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                      <Stethoscope size={14} className="text-[#E63946]" /> Clinical Presentation
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {tumor.symptoms.map(s => (
                        <span key={s} className="px-3 py-1.5 bg-red-50 text-[#E63946] rounded-xl text-[10px] font-black uppercase border border-red-100">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Research Papers Section */}
              <div className="space-y-4 pt-6 border-t border-gray-50 mt-auto">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <FileText size={14} /> Peer-Reviewed Research
                </h4>
                <div className="space-y-2">
                  {tumor.researchPapers.map((paper, pIdx) => (
                    <a 
                      key={pIdx}
                      href={paper.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all group/link border border-transparent hover:border-gray-200"
                    >
                      <span className="text-xs font-bold text-[#0A2463] truncate pr-4">{paper.title}</span>
                      <ExternalLink size={14} className="text-gray-300 group-hover/link:text-[#0A2463] shrink-0" />
                    </a>
                  ))}
                </div>
              </div>

              <div className="pt-8 border-t border-gray-50 flex items-center justify-between">
                <a 
                  href={tumor.youtubeUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-6 py-3 bg-[#E63946]/10 text-[#E63946] rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#E63946]/20 transition-all"
                >
                  <Youtube size={18} /> Watch Clinical Insight
                </a>
                <div className="flex gap-2">
                  <button className="p-3 text-gray-300 hover:text-[#0A2463] hover:bg-gray-50 rounded-2xl transition-all">
                    <Share2Icon size={20} className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <section className="bg-[#0A2463] rounded-[3rem] p-16 text-white relative overflow-hidden shadow-2xl shadow-blue-900/40">
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
           <div className="max-w-2xl">
              <h2 className="text-5xl font-black leading-tight mb-4 tracking-tight">Academic Access Protocol</h2>
              <p className="text-white/60 text-xl font-medium leading-relaxed">Leverage our high-speed federated network to query the latest clinical trials, surgical outcome datasets, and sub-specialized oncology research.</p>
           </div>
           <button className="whitespace-nowrap px-12 py-6 bg-[#2A9D8F] text-white rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-[#2A9D8F]/90 transition-all shadow-xl shadow-teal-500/20 flex items-center gap-4">
             Launch Registry <ArrowRight size={22} />
           </button>
        </div>
        <div className="absolute top-0 right-0 w-[500px] h-full opacity-10 pointer-events-none -translate-y-20 translate-x-20">
           <Brain size={600} />
        </div>
      </section>
    </div>
  );
};

// Internal icon import since it was missing in the original snippet but used here
const Share2Icon = ({ size, className }: { size: number, className: string }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
);

export default KnowledgeBasePage;
