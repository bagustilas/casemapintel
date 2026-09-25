'use client';

import React, { useEffect, useRef, useState } from 'react';
import cytoscape from 'cytoscape';
import { CaseData } from '@/types/case';
import { Network, Play, Square, RotateCcw, Info, Sparkles } from 'lucide-react';

interface IntelBoardGraphProps {
  caseData: CaseData;
}

export function IntelBoardGraph({ caseData }: IntelBoardGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);
  const simTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [isSimulating, setIsSimulating] = useState(false);
  const [currentSimStep, setCurrentSimStep] = useState<number | null>(null);
  const [hoveredNodeInfo, setHoveredNodeInfo] = useState<string | null>(null);

  const parties = caseData.parties || [];
  const evidence = caseData.availableEvidence || [];
  const rawEvents = caseData.chronology || [];

  const sortedEvents = [...rawEvents]
    .sort((a, b) => (a.datetime || '').localeCompare(b.datetime || ''))
    .map((ev, idx) => ({ ...ev, order: idx + 1, id: 'ev_' + idx }));

  useEffect(() => {
    if (!containerRef.current) return;

    // Build Cytoscape nodes and edges
    const nodes: cytoscape.NodeDefinition[] = [];
    const edges: cytoscape.EdgeDefinition[] = [];

    // 1. Party Nodes
    parties.forEach((p, idx) => {
      let nodeType = 'witness';
      if (p.role === 'Tersangka') nodeType = 'suspect';
      else if (p.role === 'Korban / Pelapor') nodeType = 'victim';

      nodes.push({
        data: {
          id: p.id || 'p_' + idx,
          label: p.name || `Pihak #${idx + 1}`,
          sublabel: p.role,
          type: nodeType,
          info: `${p.role}: ${p.name} (${p.notes || '-'})`,
        },
      });
    });

    // 2. Evidence Nodes
    evidence.forEach((ev, idx) => {
      nodes.push({
        data: {
          id: 'evid_' + idx,
          label: ev,
          sublabel: 'Alat Bukti',
          type: 'evidence',
          info: `Alat Bukti Sah: ${ev}`,
        },
      });
    });

    // 3. Chronology Event Nodes
    sortedEvents.forEach((ev, idx) => {
      const timeStr = ev.datetime
        ? new Date(ev.datetime).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
          })
        : `Event #${idx + 1}`;

      nodes.push({
        data: {
          id: ev.id,
          label: `Peristiwa #${ev.order}`,
          sublabel: timeStr,
          type: 'event',
          info: `Peristiwa #${ev.order} (${timeStr}): ${ev.location ? `[${ev.location}] ` : ''}${ev.narrative}`,
        },
      });
    });

    // 4. Edges: Auto Link based on keywords & party names
    let edgeCount = 0;
    const findKeyword = (text: string, kw: string) => {
      const first = (kw.split(/[\s,(]+/)[0] || '').toLowerCase();
      return first.length > 2 && text.toLowerCase().includes(first);
    };

    const evidenceKeywords: Record<string, string[]> = {
      'Keterangan saksi': ['saksi', 'melihat', 'kesaksian'],
      'Keterangan ahli': ['ahli', 'forensik', 'audit', 'pakar'],
      'Surat': ['surat', 'dokumen', 'laporan', 'rekening', 'kontrak'],
      'Petunjuk': ['petunjuk', 'indikasi', 'jejak'],
      'Keterangan terdakwa': ['terdakwa', 'tersangka', 'mengaku', 'keterangan'],
      'Bukti elektronik': ['cctv', 'elektronik', 'laptop', 'rekaman', 'hp', 'digital', 'dvr', 'chat', 'wa'],
    };

    sortedEvents.forEach((ev) => {
      const text = (ev.narrative || '').toLowerCase();

      // Connect to parties
      parties.forEach((p, pIdx) => {
        const pId = p.id || 'p_' + pIdx;
        if (findKeyword(text, p.name)) {
          edges.push({
            data: {
              id: `edge_${edgeCount++}`,
              source: ev.id,
              target: pId,
              label: 'terlibat',
            },
          });
        }
      });

      // Connect to evidence
      evidence.forEach((evName, evIdx) => {
        const kws = evidenceKeywords[evName] || [];
        if (kws.some((kw) => text.includes(kw))) {
          edges.push({
            data: {
              id: `edge_${edgeCount++}`,
              source: ev.id,
              target: 'evid_' + evIdx,
              label: 'alat bukti',
            },
          });
        }
      });
    });

    // Initialize Cytoscape
    if (cyRef.current) {
      cyRef.current.destroy();
    }

    const isDark = document.documentElement.classList.contains('dark');

    const cy = cytoscape({
      container: containerRef.current,
      elements: [...nodes, ...edges],
      style: [
        {
          selector: 'node',
          style: {
            'label': 'data(label)',
            'color': isDark ? '#f1f5f9' : '#1e293b',
            'font-family': 'sans-serif',
            'font-size': '11px',
            'font-weight': 600,
            'text-valign': 'bottom',
            'text-margin-y': 6,
            'text-max-width': '100px',
            'text-wrap': 'ellipsis',
            'width': 34,
            'height': 34,
            'border-width': 2,
            'border-color': isDark ? '#334155' : '#cbd5e1',
          },
        },
        {
          selector: 'node[type="suspect"]',
          style: {
            'background-color': '#e11d48',
            'border-color': '#be123c',
            'width': 40,
            'height': 40,
          },
        },
        {
          selector: 'node[type="victim"]',
          style: {
            'background-color': '#d97706',
            'border-color': '#b45309',
            'width': 36,
            'height': 36,
          },
        },
        {
          selector: 'node[type="witness"]',
          style: {
            'background-color': '#059669',
            'border-color': '#047857',
          },
        },
        {
          selector: 'node[type="evidence"]',
          style: {
            'background-color': '#2563eb',
            'border-color': '#1d4ed8',
            'shape': 'round-rectangle',
            'width': 44,
            'height': 24,
            'font-size': '10px',
          },
        },
        {
          selector: 'node[type="event"]',
          style: {
            'background-color': isDark ? '#1e293b' : '#f8fafc',
            'border-color': '#d97706',
            'border-width': 3,
            'shape': 'ellipse',
            'width': 38,
            'height': 38,
            'color': '#d97706',
            'font-weight': 'bold',
          },
        },
        {
          selector: 'edge',
          style: {
            'width': 2,
            'line-color': isDark ? '#475569' : '#cbd5e1',
            'curve-style': 'bezier',
            'opacity': 0.7,
          },
        },
        {
          selector: '.dimmed',
          style: {
            'opacity': 0.1,
          },
        },
        {
          selector: '.highlighted',
          style: {
            'opacity': 1,
            'border-width': 4,
            'border-color': '#f59e0b',
            'line-color': '#f59e0b',
            'width': 4,
          },
        },
      ],
      layout: {
        name: 'concentric',
        concentric: (node: any) => {
          const type = node.data('type');
          if (type === 'event') return 3;
          if (type === 'suspect') return 2;
          return 1;
        },
        levelWidth: () => 1,
        minNodeSpacing: 50,
        animate: false,
      },
      userZoomingEnabled: true,
      userPanningEnabled: true,
      boxSelectionEnabled: false,
    });

    cy.on('mouseover', 'node', (evt) => {
      const node = evt.target;
      setHoveredNodeInfo(node.data('info') || node.data('label'));
    });

    cy.on('mouseout', 'node', () => {
      setHoveredNodeInfo(null);
    });

    cyRef.current = cy;

    return () => {
      if (simTimerRef.current) clearInterval(simTimerRef.current);
      if (cyRef.current) cyRef.current.destroy();
    };
  }, [parties.length, evidence.length, rawEvents.length]);

  const resetHighlight = () => {
    if (simTimerRef.current) {
      clearInterval(simTimerRef.current);
      simTimerRef.current = null;
    }
    setIsSimulating(false);
    setCurrentSimStep(null);
    if (cyRef.current) {
      cyRef.current.elements().removeClass('dimmed').removeClass('highlighted');
    }
  };

  const showStep = (idx: number) => {
    if (!cyRef.current || !sortedEvents[idx]) return;
    const cy = cyRef.current;
    const ev = sortedEvents[idx];

    cy.elements().addClass('dimmed').removeClass('highlighted');
    const evNode = cy.$id(ev.id);
    const neighborhood = evNode.closedNeighborhood();

    neighborhood.removeClass('dimmed').addClass('highlighted');
    setCurrentSimStep(idx + 1);
    setHoveredNodeInfo(`Peristiwa #${ev.order}: ${ev.narrative}`);
  };

  const toggleSimulation = () => {
    if (sortedEvents.length === 0) return;

    if (isSimulating) {
      resetHighlight();
    } else {
      setIsSimulating(true);
      let step = 0;
      showStep(step);

      simTimerRef.current = setInterval(() => {
        step++;
        if (step >= sortedEvents.length) {
          resetHighlight();
        } else {
          showStep(step);
        }
      }, 2400);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm dark:border-slate-800 dark:bg-slate-900">
      {/* Graph Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 px-5 py-3.5 text-white">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500 text-slate-950 font-bold">
            <Network className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white font-serif">
              Papan Intelijen — Peta Benang Merah Perkara
            </h3>
            <p className="text-[11px] text-slate-400">
              Visualisasi relasi kausalitas subjek, alat bukti, dan peristiwa pidana
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleSimulation}
            className="inline-flex items-center gap-1.5 rounded-xl bg-amber-600 px-3 py-1.5 text-xs font-bold text-white shadow hover:bg-amber-500 transition"
          >
            {isSimulating ? (
              <>
                <Square className="h-3.5 w-3.5 fill-current" />
                <span>Hentikan Alur</span>
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>Putar Simulasi Alur</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={resetHighlight}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700 transition"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Tampilkan Semua</span>
          </button>
        </div>
      </div>

      {/* Legend & Active Step Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-slate-50 px-5 py-2.5 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-300">
        <div className="flex items-center gap-4 flex-wrap text-[11px] font-medium">
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-rose-600" /> Tersangka
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-amber-600" /> Korban/Pelapor
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-emerald-600" /> Saksi/Ahli
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-4 rounded bg-blue-600" /> Alat Bukti
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full border-2 border-amber-600 bg-white dark:bg-slate-900" /> Peristiwa Kronologi
          </span>
        </div>

        {currentSimStep && (
          <span className="font-mono text-xs font-bold text-amber-700 dark:text-amber-400">
            ▶ Tahap {currentSimStep} / {sortedEvents.length}
          </span>
        )}
      </div>

      {/* Cytoscape Container */}
      <div className="relative">
        <div ref={containerRef} className="h-[460px] w-full bg-slate-50/40 dark:bg-slate-950" />

        {hoveredNodeInfo && (
          <div className="absolute bottom-3 left-3 right-3 rounded-xl border border-slate-200 bg-white/95 p-3 text-xs text-slate-800 shadow-lg backdrop-blur dark:border-slate-800 dark:bg-slate-900/95 dark:text-slate-200">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="line-clamp-2">{hoveredNodeInfo}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
