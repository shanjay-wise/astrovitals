/**
 * NASA Bundled Sample Datasets
 * High-fidelity fallback data when API keys are absent or NASA services are rate-limited.
 * Citations: NASA DONKI, NASA APOD, NASA OSDR (Open Science Data Repository) / GeneLab.
 */

export const sampleDonkiEvents = [
  {
    flrID: '2026-06-12T14:15:00-FLR-001',
    beginTime: '2026-06-12T14:05Z',
    peakTime: '2026-06-12T14:18Z',
    endTime: '2026-06-12T14:32Z',
    classType: 'M4.2',
    sourceLocation: 'N18W42',
    activeRegionNum: 13695,
    note: 'Moderate M-class flare detected by GOES-18 SXI. Accelerated coronal proton flux observed.'
  },
  {
    flrID: '2026-06-13T09:40:00-FLR-002',
    beginTime: '2026-06-13T09:30Z',
    peakTime: '2026-06-13T09:44Z',
    endTime: '2026-06-13T10:02Z',
    classType: 'C8.7',
    sourceLocation: 'S22E14',
    activeRegionNum: 13697,
    note: 'Sub-M class energetic event. Background solar wind density elevated.'
  },
  {
    flrID: '2026-06-14T03:10:00-FLR-003',
    beginTime: '2026-06-14T02:50Z',
    peakTime: '2026-06-14T03:12Z',
    endTime: '2026-06-14T03:45Z',
    classType: 'X1.1',
    sourceLocation: 'N15E08',
    activeRegionNum: 13702,
    note: 'Major X-class flare with fast halo CME component. Triggers Deep Space Radiation Shelter Standby.'
  }
]

export const sampleCmeEvents = [
  {
    activityID: '2026-06-14T04:00:00-CME-001',
    catalog: 'SWRC_CATALOG',
    startTime: '2026-06-14T03:36Z',
    sourceLocation: 'N15E08',
    speed: 1240, // km/s
    type: 'Halo',
    halfAngle: 65,
    associatedFlare: '2026-06-14T03:10:00-FLR-003',
    impactRisk: 'Elevated for interplanetary Mars transit trajectory'
  }
]

export const sampleApod = {
  date: '2026-06-14',
  title: 'Earth-Moon Transit from Mars Reconnaissance',
  explanation: 'Looking back from deep interplanetary space, our home world Earth and its Moon appear as twin beacons suspended in the cosmic ocean. Captured during long-duration human spaceflight cruise phase.',
  url: 'https://images-assets.nasa.gov/image/PIA14421/PIA14421~orig.jpg',
  media_type: 'image',
  copyright: 'NASA / JPL-Caltech / Univ. of Arizona'
}

export const osdrGeneLabDatasets = [
  {
    accession: 'OSDR-137',
    title: 'NASA Twins Study: Multi-Omic Assessment of a One-Year Spaceflight',
    organism: 'Homo sapiens (Twin Astronauts)',
    assayType: 'Whole Genome Sequencing, RNA-Seq, Telomere Length, Proteomics',
    mission: 'ISS One-Year Mission',
    keyFinding: 'Telomere lengthening during flight followed by rapid shortening post-landing; vascular stiffening; 91% transcriptomic return to baseline within 6 months.',
    link: 'https://osdr.nasa.gov/bio/repo/data/studies/OSDR-137'
  },
  {
    accession: 'OSDR-242',
    title: 'Transcriptomic and Epigenetic Remodeling in Astronaut Immune Cells Under Microgravity',
    organism: 'Homo sapiens',
    assayType: 'Single-cell RNA-seq, ATAC-seq',
    mission: 'SpaceX Inspiration4 / Axiom-1',
    keyFinding: 'T-cell receptor suppression and reactivation of dormant viral sequences (EBV, VZV) induced by spaceflight stress and microgravity fluid shifts.',
    link: 'https://osdr.nasa.gov/bio/repo/data/studies/OSDR-242'
  },
  {
    accession: 'OSDR-455',
    title: 'Space Radiation-Induced DNA Damage Kinetics in Human Cardiomyocytes',
    organism: 'Homo sapiens (iPSC-derived)',
    assayType: 'Phospho-H2AX immunofluorescence, Comet Assay',
    mission: 'Brookhaven NASA Space Radiation Lab (NSRL)',
    keyFinding: 'High-LET iron ion irradiation generates complex, clustered double-strand breaks that resist standard non-homologous end joining (NHEJ) repair.',
    link: 'https://osdr.nasa.gov/bio/repo/data/studies/OSDR-455'
  }
]
