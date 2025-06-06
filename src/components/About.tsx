import { BarChart3, Target, Users, Zap } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-[#161C40] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            About <span className="text-gradient-brand">Lytrana</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            We&apos;re on a mission to make data analysis accessible to everyone, 
            transforming complex datasets into clear, actionable insights.
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-[#1A2250] rounded-2xl p-8 md:p-12 mb-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">Our Mission</h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                At Lytrana, we believe that every organization deserves access to powerful 
                data analytics, regardless of their technical expertise. We&apos;re democratizing 
                data science by making it simple, intuitive, and accessible.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed">
                Our platform combines cutting-edge AI with user-friendly design to help 
                teams discover insights that drive better decision-making.
              </p>
            </div>
            <div className="flex justify-center">
              <div className="w-32 h-32 gradient-brand rounded-full flex items-center justify-center">
                <Target className="w-16 h-16 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            What Drives Us
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 gradient-brand rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Simplicity</h3>
              <p className="text-gray-300">
                Complex data analysis shouldn&apos;t require a PhD. We make powerful 
                analytics tools that anyone can use.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 gradient-brand rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Collaboration</h3>
              <p className="text-gray-300">
                Great insights come from great teamwork. We build tools that 
                bring teams together around data.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 gradient-brand rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Innovation</h3>
              <p className="text-gray-300">
                We&apos;re constantly pushing the boundaries of what&apos;s possible with 
                AI-powered data analysis.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-[#1A2250] rounded-2xl p-8 md:p-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Data?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of teams who trust Lytrana to turn their data into actionable insights.
          </p>
          <button className="gradient-brand px-8 py-4 text-white font-semibold rounded-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
            Get Started Today
          </button>
        </div>
      </div>
    </div>
  );
};

export default About;