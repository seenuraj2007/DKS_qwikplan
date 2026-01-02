// 'use client'

// import { useState } from 'react'
// import { Calendar, Loader2 } from 'lucide-react'

// export default function DemoSection() {
//   const [selectedNiche, setSelectedNiche] = useState('Sustainable Fashion')
//   const [selectedPlatform, setSelectedPlatform] = useState('Instagram')
//   const [generatedStrategy, setGeneratedStrategy] = useState<any>(null)
//   const [isGenerating, setIsGenerating] = useState(false)
//   const [demoError, setDemoError] = useState('')

//   const demoNiches = ['Sustainable Fashion', 'Tech SaaS', 'Food Blogging', 'Fitness Coaching']
//   const demoPlatforms = ['Instagram', 'LinkedIn', 'YouTube', 'Twitter']

//   const handleDemoGenerate = async () => {
//     setIsGenerating(true)
//     setDemoError('')
//     setGeneratedStrategy(null)

//     try {
//       const res = await fetch('/api/demo-generate', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           niche: selectedNiche,
//           platform: selectedPlatform,
//           goal: 'Increase engagement and brand awareness',
//           isDemo: true
//         }),
//       })

//       if (!res.ok) {
//         throw new Error('Failed to generate strategy')
//       }

//       const data = await res.json()
      
//       if (data.schedule && Array.isArray(data.schedule)) {
//         data.schedule = data.schedule.slice(0, 2)
//       }
      
//       setGeneratedStrategy(data)
//     } catch (error) {
//       console.error('Demo generation error:', error)
//       setDemoError('Unable to generate preview. Try signing up for full access.')
//       setGeneratedStrategy({
//         strategy: `Focus on educational content about ${selectedNiche} to build authority.`,
//         schedule: [
//           "Day 1: Share tips and best practices",
//           "Day 2: Showcase success stories and examples"
//         ],
//         proTip: "Post when your audience is most active for maximum reach.",
//         bestPostTime: "Weekdays: 10:00 AM - 2:00 PM",
//         hashtags: "#IndustryTips #BestPractices #Growth"
//       })
//     } finally {
//       setIsGenerating(false)
//     }
//   }

//   return (
//     <section id="demo" className="py-16 max-w-7xl mx-auto px-6">
//       <div className="text-center mb-12">
//         <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Try It Now - No Signup Needed</h2>
//         <p className="text-lg text-slate-600">See how fast you can get a complete content strategy</p>
//       </div>

//       <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 border border-slate-200 shadow-lg">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//           <div>
//             <label className="block text-sm font-semibold text-slate-700 mb-2">Select Your Niche</label>
//             <select 
//               value={selectedNiche}
//               onChange={(e) => setSelectedNiche(e.target.value)}
//               className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
//             >
//               {demoNiches.map(niche => (
//                 <option key={niche} value={niche}>{niche}</option>
//               ))}
//             </select>
//           </div>
//           <div>
//             <label className="block text-sm font-semibold text-slate-700 mb-2">Select Platform</label>
//             <select 
//               value={selectedPlatform}
//               onChange={(e) => setSelectedPlatform(e.target.value)}
//               className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
//             >
//               {demoPlatforms.map(platform => (
//                 <option key={platform} value={platform}>{platform}</option>
//               ))}
//             </select>
//           </div>
//         </div>
        
//         <button 
//           onClick={handleDemoGenerate}
//           disabled={isGenerating}
//           className="w-full h-12 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 transition-all transform hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//         >
//           {isGenerating ? (
//             <>
//               <Loader2 className="w-5 h-5 animate-spin" />
//               Generating...
//             </>
//           ) : (
//             'Generate Sample Strategy'
//           )}
//         </button>

//         {demoError && (
//           <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
//             {demoError}
//           </div>
//         )}

//         <div className="mt-8 p-6 bg-slate-50 rounded-xl border border-slate-200">
//           <div className="flex items-center gap-2 mb-4">
//             <Calendar className="w-5 h-5 text-emerald-600" />
//             <h3 className="font-bold text-slate-900">Sample Output Preview</h3>
//           </div>
          
//           {generatedStrategy ? (
//             <div className="space-y-4 text-sm text-slate-700">
//               <div className="p-4 bg-white rounded-lg border border-slate-200">
//                 <h4 className="font-semibold text-emerald-700 mb-2">Strategy</h4>
//                 <p>{generatedStrategy.strategy}</p>
//               </div>
              
//               <div className="space-y-3">
//                 {generatedStrategy.schedule?.map((day: string, idx: number) => (
//                   <div key={idx} className="p-3 bg-white rounded-lg border border-slate-200">
//                     <div className="font-semibold text-emerald-700">
//                       {day.split(':')[0]}
//                     </div>
//                     <div className="text-slate-600 mt-1">
//                       {day.split(':').slice(1).join(':')}
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
//                 <div className="p-3 bg-white rounded-lg border border-slate-200">
//                   <div className="font-semibold text-slate-800 mb-1">Pro tip</div>
//                   <p className="text-slate-600">
//                     {generatedStrategy.proTip}
//                   </p>
//                 </div>
//                 <div className="p-3 bg-white rounded-lg border border-slate-200">
//                   <div className="font-semibold text-slate-800 mb-1">Best time & hashtags</div>
//                   <p className="text-slate-600">
//                     <span className="block mb-1">{generatedStrategy.bestPostTime}</span>
//                     <span className="block text-emerald-700 font-mono">
//                       {generatedStrategy.hashtags}
//                     </span>
//                   </p>
//                 </div>
//               </div>

//               <p className="text-center text-slate-500 text-xs mt-4">
//                 This is a 2‑day preview. Full 7‑day plan and CSV export available after free signup.
//               </p>
//             </div>
//           ) : (
//             <div className="space-y-3 text-sm text-slate-700">
//               <div className="p-3 bg-white rounded-lg border border-slate-200">
//                 <div className="font-semibold text-emerald-700">Day 1 - Monday</div>
//                 <div className="text-slate-600">
//                   Post: &quot;5 Sustainable Fashion Myths Debunked&quot; (Carousel)
//                 </div>
//                 <div className="text-xs text-slate-500">
//                   Best time: 10:00 AM | Hashtags: #SustainableFashion #EcoStyle
//                 </div>
//               </div>
//               <div className="p-3 bg-white rounded-lg border border-slate-200">
//                 <div className="font-semibold text-emerald-700">Day 2 - Tuesday</div>
//                 <div className="text-slate-600">
//                   Post: Behind‑the‑scenes of ethical manufacturing (Reels)
//                 </div>
//                 <div className="text-xs text-slate-500">
//                   Best time: 7:00 PM | Hashtags: #EthicalFashion #SlowFashion
//                 </div>
//               </div>
//               <p className="text-center text-slate-500 text-xs mt-4">
//                 Click “Generate Sample Strategy” to see AI‑generated content for your selections.
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     </section>
//   )
// }
