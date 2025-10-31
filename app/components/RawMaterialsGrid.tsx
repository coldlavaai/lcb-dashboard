'use client';

import AdvancedChart from './AdvancedChart';

interface RawMaterialsGridProps {
  data: any[];
}

export default function RawMaterialsGrid({ data }: RawMaterialsGridProps) {
  const materials = [
    {
      field: 'CZCE yarn usc/lb',
      title: 'CZCE Yarn',
      description: 'China Cotton Yarn Futures',
      color: '#8B5CF6',
    },
    {
      field: 'CZCE PSF usc/lb',
      title: 'CZCE PSF',
      description: 'Polyester Staple Fiber (China)',
      color: '#EC4899',
    },
    {
      field: 'CZCE PTA usc/lb',
      title: 'CZCE PTA',
      description: 'Purified Terephthalic Acid (China)',
      color: '#F59E0B',
    },
    {
      field: 'CC-Index usc/lb',
      title: 'CC-Index',
      description: 'China Cotton Index',
      color: '#10B981',
    },
    {
      field: 'CEPEA',
      title: 'CEPEA',
      description: 'Brazil Cotton Price Index',
      color: '#3B82F6',
    },
    {
      field: 'A-Index',
      title: 'Cotlook A-Index',
      description: 'International Cotton Benchmark',
      color: '#D4AF37',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      {materials.map((material) => (
        <AdvancedChart
          key={material.field}
          data={data}
          spread={material.field}
          title={material.title}
          description={material.description}
          color={material.color}
        />
      ))}
    </div>
  );
}
