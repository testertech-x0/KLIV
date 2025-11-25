import React from 'react';
import { MapPin, Mail, Phone } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <div className="p-8 flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
      <div className="space-y-12 w-full max-w-md">
        
        {/* Address */}
        <div className="flex items-start space-x-6 group">
            <div className="p-4 bg-purple-100 rounded-full text-purple-700 group-hover:bg-purple-700 group-hover:text-white transition duration-300">
                <MapPin className="w-8 h-8" />
            </div>
            <div className="flex-1">
                 <p className="text-purple-900 font-medium text-sm text-center sm:text-left">
                     Directorate of State Lotteries<br/>
                     Vikas Bhavan P.O Thiruvananthapuram
                 </p>
            </div>
        </div>

        {/* Email */}
        <div className="flex items-center space-x-6 group">
            <div className="p-4 bg-purple-100 rounded-full text-purple-700 group-hover:bg-purple-700 group-hover:text-white transition duration-300">
                <Mail className="w-8 h-8" />
            </div>
            <div className="flex-1 text-center sm:text-left">
                 <a href="mailto:cru.dir.lotteries@kerala.gov.in" className="text-blue-600 font-medium hover:underline text-sm sm:text-base break-all">
                    cru.dir.lotteries@kerala.gov.in
                 </a>
            </div>
        </div>

        {/* Phone */}
        <div className="flex items-center space-x-6 group">
            <div className="p-4 bg-purple-100 rounded-full text-purple-700 group-hover:bg-purple-700 group-hover:text-white transition duration-300">
                <Phone className="w-8 h-8" />
            </div>
            <div className="flex-1 text-center sm:text-left">
                 <p className="text-blue-600 font-bold text-lg">0471-2305193</p>
                 <p className="text-blue-600 font-bold text-lg">0471-2305230</p>
            </div>
        </div>

      </div>
    </div>
  );
};

export default Contact;