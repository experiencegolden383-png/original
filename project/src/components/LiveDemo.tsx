import { MapPin, Phone, Star, Loader } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_SUPABASE_ANON_KEY
);

interface Hospital {
  id: string;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  rating: number;
  available_beds: number;
}

export default function LiveDemo() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const { data, error } = await supabase
          .from('hospitals')
          .select(`
            id,
            name,
            location,
            latitude,
            longitude,
            rating,
            bed_availability (available_beds)
          `);

        if (error) throw error;

        const formattedData = data?.map((h: any) => ({
          id: h.id,
          name: h.name,
          location: h.location,
          latitude: h.latitude,
          longitude: h.longitude,
          rating: h.rating,
          available_beds: h.bed_availability?.[0]?.available_beds || 0,
        })) || [];

        setHospitals(formattedData);
      } catch (err) {
        console.error('Error fetching hospitals:', err);
        setHospitals([
          {
            id: '1',
            name: 'CWS Hospital',
            location: 'Rourkela',
            latitude: 22.2035,
            longitude: 84.8447,
            rating: 4.8,
            available_beds: 50,
          },
          {
            id: '2',
            name: 'RGH Government Hospital',
            location: 'Rourkela',
            latitude: 22.2258,
            longitude: 84.8436,
            rating: 4.5,
            available_beds: 5,
          },
          {
            id: '3',
            name: 'Hi-Tech Medical College',
            location: 'Rourkela',
            latitude: 22.215,
            longitude: 84.83,
            rating: 4.7,
            available_beds: 0,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchHospitals();
  }, []);

  const getStatusInfo = (beds: number) => {
    if (beds > 20) return { color: 'bg-[#10B981]', label: 'Available', textColor: 'text-[#10B981]' };
    if (beds > 0) return { color: 'bg-[#F59E0B]', label: 'Limited', textColor: 'text-[#F59E0B]' };
    return { color: 'bg-[#EF4444]', label: 'Full', textColor: 'text-[#EF4444]' };
  };

  const getDistanceAndTime = (lat: number, lon: number) => {
    const userLat = 22.2258;
    const userLon = 84.8436;
    const R = 6371;
    const dLat = ((lat - userLat) * Math.PI) / 180;
    const dLon = ((lon - userLon) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((userLat * Math.PI) / 180) *
        Math.cos((lat * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    const time = Math.round((distance / 40) * 60);
    return { distance: distance.toFixed(1), time };
  };

  return (
    <section id="demo" className="py-24 px-6 bg-[#F9FAFB]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[#1F2937] mb-6">
            See It In Action
          </h2>
          <p className="text-xl text-[#6B7280]">
            Find nearby hospitals with available beds in seconds
          </p>
        </div>

        <div className="bg-[#E5E7EB] rounded-2xl p-1 shadow-2xl">
          <div className="bg-white rounded-t-xl px-4 py-3 flex items-center gap-2">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-[#EF4444]"></div>
              <div className="w-3 h-3 rounded-full bg-[#F59E0B]"></div>
              <div className="w-3 h-3 rounded-full bg-[#10B981]"></div>
            </div>
            <div className="flex-1 text-center text-sm text-[#6B7280] font-medium">
              jeeva.care/search
            </div>
          </div>

          <div className="bg-white rounded-b-xl p-8">
            <div className="mb-6 flex items-center gap-3 bg-[#F3F4F6] rounded-xl px-4 py-4">
              <MapPin size={24} className="text-[#3B82F6]" />
              <input
                type="text"
                placeholder="Rourkela, 5km"
                className="flex-1 bg-transparent outline-none text-[#1F2937] text-lg"
                defaultValue="Rourkela, 5km"
              />
              <button className="bg-[#3B82F6] text-white px-6 py-2 rounded-lg hover:bg-[#2563EB] transition-colors font-medium">
                Search
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader size={32} className="text-[#3B82F6] animate-spin" />
              </div>
            ) : (
              <div className="space-y-4">
                {hospitals.map((hospital) => {
                  const { distance, time } = getDistanceAndTime(hospital.latitude, hospital.longitude);
                  const status = getStatusInfo(hospital.available_beds);

                  return (
                    <div
                      key={hospital.id}
                      className="border border-[#E5E7EB] rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:border-[#3B82F6] hover:-translate-y-1"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-[#1F2937] mb-2">
                            {hospital.name}
                          </h3>
                          <div className="flex items-center gap-2 mb-3">
                            <span
                              className={`inline-flex items-center gap-1 ${status.color} text-white px-3 py-1 rounded-full text-sm font-medium`}
                            >
                              <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                              {hospital.available_beds} beds
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-[#6B7280]">
                            <span>{distance} km</span>
                            <span>•</span>
                            <span>{time} mins</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Star size={16} className="text-[#F59E0B] fill-[#F59E0B]" />
                              {hospital.rating}
                            </span>
                          </div>
                        </div>
                        <button className="bg-[#3B82F6] text-white px-6 py-3 rounded-xl hover:bg-[#2563EB] transition-all duration-300 hover:shadow-lg flex items-center gap-2 font-medium whitespace-nowrap">
                          <Phone size={18} />
                          Call Now
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
