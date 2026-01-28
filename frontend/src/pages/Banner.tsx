
// "use client"

// import { useState, useEffect } from "react"
// import {
//   Play,
//   ArrowRight,
//   CheckCircle,
//   Sparkles,
//   Zap,
//   Globe,
//   Users,
//   TrendingUp,
//   Star,
//   Award,
//   BookOpen,
//   Code2,
//   X,
//   Circle,
// } from "lucide-react"

// export default function HeroTwo() {

//   const [isLoaded, setIsLoaded] = useState(false)
  
 

//   const features = [
//     {
//       icon: Code2,
//       title: "Interactive Learning",
//       description: "Learn by doing with hands-on coding exercises",
//       color: "from-blue-500 to-cyan-400",
//     },
//     {
//       icon: Users,
//       title: "Expert Mentorship",
//       description: "Get guidance from industry professionals",
//       color: "from-purple-500 to-pink-400",
//     },
//     {
//       icon: Award,
//       title: "Certification",
//       description: "Earn recognized certificates upon completion",
//       color: "from-green-500 to-emerald-400",
//     },
//     {
//       icon: TrendingUp,
//       title: "Career Growth",
//       description: "Advance your career with in-demand skills",
//       color: "from-orange-500 to-red-400",
//     },
//   ]

//   const testimonials = [
//     {
//       name: "Sarah Chen",
//       role: "Software Engineer at Google",
//       content: "ChaiCode transformed my career. The practical approach helped me land my dream job.",
//       rating: 5,
//       avatar: "👩‍💻",
//     },
//     {
//       name: "Raj Patel",
//       role: "Full Stack Developer",
//       content: "Best investment I made. The mentorship program is incredible.",
//       rating: 5,
//       avatar: "👨‍💻",
//     },
//     {
//       name: "Emily Johnson",
//       role: "Frontend Developer",
//       content: "From zero to hero in 6 months. Highly recommend ChaiCode!",
//       rating: 5,
//       avatar: "👩‍🎨",
//     },
//   ]

//   const stats = [
//     { number: "100K+", label: "Students Enrolled", icon: Users },
//     { number: "500+", label: "Courses Available", icon: BookOpen },
//     { number: "98%", label: "Success Rate", icon: TrendingUp },
//     { number: "50+", label: "Countries", icon: Globe },
//   ]

//   useEffect(() => {
//     setIsLoaded(true)
   
//   }, [])



//   return (
//     <div
//       className="relative min-h-screen bg-gradient-to-br from-slate-900  to-slate-900 overflow-hidden"
    
//     >
    

//       <div className="relative z-10  mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
//         {/* Testimonials Section */}
//         <div
//           className={
//             "mb-20 transition-all duration-1000 delay-700 bg-r " +
//             (isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")
//           }
//         >
//           <div className="text-center mb-12">
//             <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
//               Success
//               <span className=" bg-orange-700 bg-clip-text text-transparent">
//                 Stories
//               </span>
//             </h2>
//             <p className="text-xl text-gray-300">Hear from our graduates who landed their dream jobs</p>
//           </div>

//           <div className="grid md:grid-cols-3 gap-8">
//             {testimonials.map((testimonial, index) => (
//               <div
//                 key={index}
//                 className="group p-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl hover:border-white/20 transition-all duration-300 hover:scale-105"
//               >
//                 <div className="flex items-center mb-4">
//                   {[...Array(testimonial.rating)].map((_, i) => (
//                     <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
//                   ))}
//                 </div>
//                 <p className="text-gray-300 mb-6 leading-relaxed italic">"{testimonial.content}"</p>
//                 <div className="flex items-center space-x-4">
//                   <div className="text-3xl">{testimonial.avatar}</div>
//                   <div>
//                     <div className="text-white font-semibold">{testimonial.name}</div>
//                     <div className="text-gray-400 text-sm">{testimonial.role}</div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Final CTA Section */}
//         <div
//           className={
//             "text-center py-16 transition-all duration-1000 delay-900 " +
//             (isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")
//           }
//         >
//           <div className="bg-gradient-to-r from-red-500/10 to-purple-600/10 backdrop-blur-md border border-white/20 rounded-3xl p-12 max-w-4xl mx-auto">
//             <div className="flex items-center justify-center mb-6">
//               <Circle className="w-8 h-8 text-orange-400 mr-3 animate-bounce" />
//               <span className="text-2xl font-bold text-white">Limited Time Offer</span>
//             </div>

//             <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">Start Your Coding Journey Today</h3>
//             <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
//               Join our next cohort and get 50% off your first month. Transform your career in just 12 weeks with our
//               intensive bootcamp.
//             </p>

//             <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
//               <button className="group relative px-12 py-5 bg-gradient-to-r  text-white font-bold text-xl rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-cyan-500/25 hover:scale-105 flex items-center space-x-3">
//                 <span>Enroll Now - 50% Off</span>
//                 <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
//               </button>

//               <div className="text-center">
//                 <div className="text-2xl font-bold text-white">
//                   $49<span className="text-lg text-gray-400 line-through ml-2">$99</span>
//                 </div>
//                 <div className="text-sm text-gray-400">per month</div>
//               </div>
//             </div>

//             <div className="flex justify-center items-center mt-8 space-x-8 text-gray-400">
//               <div className="flex items-center space-x-2">
//                 <CheckCircle className="w-5 h-5 text-green-400" />
//                 <span>30-day money back</span>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <CheckCircle className="w-5 h-5 text-green-400" />
//                 <span>Cancel anytime</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>


//     </div>
//   )
// }
