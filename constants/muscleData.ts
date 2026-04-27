export type DisplayMode = 'standard' | 'double';

export interface Muscle {
    id: string;
    name: string;
    displayMode: DisplayMode;
    baseImage?: string;
    highlightImage?: string;
    image1?: string;
    image2?: string;
    anatomicalAccident: {
        title: string;
    };
}

export const muscleData: Muscle[] = [
    // --- Ordem pedagógica do roteiro da monitoria ---
    // 1. Músculo Corrugador do Supercílio
    {
        id: 'corrugador-do-supercilio',
        name: 'Músculo Corrugador do Supercílio',
        displayMode: 'standard',
        baseImage: '/images/cranio-masseter-base.png',
        highlightImage: '/images/musculo-corrugador-do-supercilio.png',
        anatomicalAccident: { title: 'Arco superciliar' },
    },
    // 2. Músculo Prócero
    {
        id: 'procero',
        name: 'Músculo Prócero',
        displayMode: 'standard',
        baseImage: '/images/cranio-masseter-base.png',
        highlightImage: '/images/musculo-procero.png',
        anatomicalAccident: { title: 'Glabela' },
    },
    // 3. Músculo Zigomático Menor
    {
        id: 'zigomatico-menor',
        name: 'Músculo Zigomático Menor',
        displayMode: 'standard',
        baseImage: '/images/cranio-masseter-base.png',
        highlightImage: '/images/musculo-zigomatico-menor.png',
        anatomicalAccident: { title: 'Corpo do osso zigomático' },
    },
    // 4. Músculo Zigomático Maior
    {
        id: 'zigomatico-maior',
        name: 'Músculo Zigomático Maior',
        displayMode: 'standard',
        baseImage: '/images/cranio-masseter-base.png',
        highlightImage: '/images/musculo-zigomatico-maior.png',
        anatomicalAccident: { title: 'Borda lateral do osso zigomático' },
    },
    // 5. Porção Superficial do Músculo Masseter
    {
        id: 'masseter',
        name: 'Porção Superficial do Músculo Masseter',
        displayMode: 'standard',
        baseImage: '/images/cranio-masseter-base.png',
        highlightImage: '/images/cranio-masseter-highlight.png',
        anatomicalAccident: { title: 'Borda inferior do Osso Zigomático' },
    },
    // 6. Parte Profunda do Músculo Masseter
    {
        id: 'parte-profunda-do-masseter',
        name: 'Parte Profunda do Músculo Masseter',
        displayMode: 'standard',
        baseImage: '/images/cranio-masseter-base.png',
        highlightImage: '/images/parte-profunda-do-masseter.png',
        anatomicalAccident: { title: 'Borda inferior do arco zigomático' },
    },
    // 7. Músculo Elevador do Lábio Superior e da Asa do Nariz
    {
        id: 'elevador-do-labio-superior-e-da-asa-do-nariz',
        name: 'Músculo Elevador do Lábio Superior e da Asa do Nariz',
        displayMode: 'standard',
        baseImage: '/images/cranio-masseter-base.png',
        highlightImage: '/images/musculo-elevador-do-labio-superior-e-da-asa-do-nariz.png',
        anatomicalAccident: { title: 'Processo frontal da maxila' },
    },
    // 8. Músculo Elevador do Lábio Superior
    {
        id: 'elevador-do-labio-superior',
        name: 'Músculo Elevador do Lábio Superior',
        displayMode: 'standard',
        baseImage: '/images/cranio-masseter-base.png',
        highlightImage: '/images/musculo-elevador-do-labio-superior.png',
        anatomicalAccident: { title: 'Margem infraorbitária' },
    },
    // 9. Músculo Elevador do Ângulo da Boca
    {
        id: 'elevador-do-angulo-da-boca',
        name: 'Músculo Elevador do Ângulo da Boca',
        displayMode: 'standard',
        baseImage: '/images/cranio-masseter-base.png',
        highlightImage: '/images/musculo-elevador-do-angulo-da-boca.png',
        anatomicalAccident: { title: 'Fossa canina' },
    },
    // 10. Músculo Nasal
    {
        id: 'nasal',
        name: 'Músculo Nasal',
        displayMode: 'standard',
        baseImage: '/images/cranio-masseter-base.png',
        highlightImage: '/images/musculo-nasal.png',
        anatomicalAccident: { title: 'Fossas incisivas da maxila e eminência canina' },
    },
    // 11. Músculo Depressor do Septo Nasal
    {
        id: 'depressor-do-septo-nasal',
        name: 'Músculo Depressor do Septo Nasal',
        displayMode: 'standard',
        baseImage: '/images/cranio-masseter-base.png',
        highlightImage: '/images/musculo-depressor-do-septo-nasal.png',
        anatomicalAccident: { title: 'Espinha nasal anterior' },
    },
    // 12. Músculo Depressor do Lábio Inferior
    {
        id: 'depressor-do-labio-inferior',
        name: 'Músculo depressor do lábio inferior',
        displayMode: 'standard',
        baseImage: '/images/cranio-masseter-base.png',
        highlightImage: '/images/musculo-depressor-do-labio-inferior.png',
        anatomicalAccident: { title: 'Borda inferior da mandíbula' },
    },
    // 13. Músculo Depressor do Ângulo da Boca
    {
        id: 'depressor-do-angulo-da-boca',
        name: 'Músculo depressor do ângulo da boca',
        displayMode: 'standard',
        baseImage: '/images/cranio-masseter-base.png',
        highlightImage: '/images/musculo-depressor-do-angulo-da-boca.png',
        anatomicalAccident: { title: 'Borda inferior da mandíbula' },
    },
    // 14. Músculo Bucinador
    {
        id: 'bucinador',
        name: 'Músculo Bucinador',
        displayMode: 'double',
        image1: '/images/musculo-bucinador.png',
        image2: '/images/processos-alveolares-dos-molares-da-maxila-e-da-mandibula.png',
        anatomicalAccident: { title: 'Processos alveolares dos molares da maxila e da mandíbula' },
    },
    // 15. Músculo da Úvula
    {
        id: 'uvula',
        name: 'Músculo da Úvula',
        displayMode: 'double',
        image1: '/images/musculo-da-uvula.png',
        image2: '/images/espinha-nasal-posterior.png',
        anatomicalAccident: { title: 'Espinha nasal posterior' },
    },
    // 16. Músculo Geniohioideo
    {
        id: 'geniohioideo',
        name: 'Músculo Geniohioideo',
        displayMode: 'double',
        image1: '/images/musculo-geniohioideo.png',
        image2: '/images/espinhas-genianas.png',
        anatomicalAccident: { title: 'Espinhas genianas' },
    },
    // 17. Músculo Milohioideo
    {
        id: 'milohioideo',
        name: 'Músculo Milohioideo',
        displayMode: 'double',
        image1: '/images/milohioideo.png',
        image2: '/images/linha-milohioidea.png',
        anatomicalAccident: { title: 'Linha milohioidea' },
    },
    // 18. Porção Superior do Músculo Pterigoideo Lateral
    {
        id: 'porcao-superior-do-musculo-pterigoideo-lateral',
        name: 'Porção Superior do Músculo Pterigoideo Lateral',
        displayMode: 'double',
        image1: '/images/musculo-porcao-superior-do-musculo-pterigoideo-lateral.png',
        image2: '/images/crista-infratemporal.png',
        anatomicalAccident: { title: 'Crista infratemporal' },
    },
    // 19. Porção Inferior do Músculo Pterigoideo Lateral
    {
        id: 'porcao-inferior-do-musculo-pterigoideo-lateral',
        name: 'Porção Inferior do Músculo Pterigoideo Lateral',
        displayMode: 'double',
        image1: '/images/musculo-porcao-inferior-do-musculo-pterigoideo-lateral.png',
        image2: '/images/lamina-lateral-do-processo-pterigoide.png',
        anatomicalAccident: { title: 'Lâmina lateral do processo pterigoideo' },
    },
    // 20. Músculo Pterigoideo Medial
    {
        id: 'pterigoideo-medial',
        name: 'Músculo Pterigoideo Medial',
        displayMode: 'double',
        image1: '/images/musculo-pterigoideo-medial.png',
        image2: '/images/fossa-pterigoidea.png',
        anatomicalAccident: { title: 'Fossa pterigoidea' },
    },
    // 21. Músculo Tensor do Véu Palatino (consolidado)
    {
        id: 'tensor-do-veu-palatino',
        name: 'Músculo Tensor do Véu Palatino',
        displayMode: 'double',
        image1: '/images/musculo-tensor-do-veu-palatino.png',
        image2: '/images/fossa-escafoide-e-hamulo-pterigoideo.png',
        anatomicalAccident: { title: 'Fossa escafoide e hâmulo pterigoideo' },
    },
    // 22. Músculo Estiloglosso
    {
        id: 'estiloglosso',
        name: 'Músculo Estiloglosso',
        displayMode: 'double',
        image1: '/images/musculo-estiloglosso.png',
        image2: '/images/processo-estiloide.png',
        anatomicalAccident: { title: 'Processo estiloide' },
    },
    // 23. Músculo Estilohioideo
    {
        id: 'estilohioideo',
        name: 'Músculo Estilohioideo',
        displayMode: 'double',
        image1: '/images/musculo-estilohioideo.png',
        image2: '/images/processo-estiloide.png',
        anatomicalAccident: { title: 'Processo estiloide' },
    },
    // 24. Músculo Esternocleidomastoideo
    {
        id: 'esternocleidomastoideo',
        name: 'Músculo Esternocleidomastoideo',
        displayMode: 'double',
        image1: '/images/musculo-esternocleidomastoideo.png',
        image2: '/images/processo-mastoide.png',
        anatomicalAccident: { title: 'Processo mastoide' },
    },
    // 25. Ventre Anterior do Músculo Digástrico
    {
        id: 'ventre-anterior-do-musculo-digastrico',
        name: 'Ventre Anterior do Músculo Digástrico',
        displayMode: 'double',
        image1: '/images/musculo-ventre-anterior-do-musculo-digastrico.png',
        image2: '/images/fossas-digastricas.png',
        anatomicalAccident: { title: 'Fossas digástricas' },
    },
    // 26. Ventre Posterior do Músculo Digástrico
    {
        id: 'ventre-posterior-do-musculo-digastrico',
        name: 'Ventre Posterior do Músculo Digástrico',
        displayMode: 'double',
        image1: '/images/musculo-ventre-posterior-do-musculo-digastrico.png',
        image2: '/images/incisura-mastoide.png',
        anatomicalAccident: { title: 'Incisura mastoide' },
    },
    // 27. Músculo Elevador do Véu Palatino
    {
        id: 'elevador-do-veu-palatino',
        name: 'Músculo Elevador do Véu Palatino',
        displayMode: 'double',
        image1: '/images/musculo-elevador-do-veu-palatino.png',
        image2: '/images/porcao-petrosa-do-temporal.png',
        anatomicalAccident: { title: 'Porção petrosa do temporal' },
    },

    // --- Músculos existentes fora do roteiro pedagógico (mantidos ao final) ---
    {
        id: 'temporal',
        name: 'Músculo Temporal',
        displayMode: 'standard',
        baseImage: '/images/cranio-masseter-base.png',
        highlightImage: '/images/musculo-temporal.png',
        anatomicalAccident: { title: 'Fossa temporal' },
    },
    {
        id: 'orbicular-da-boca',
        name: 'Músculo Orbicular da Boca',
        displayMode: 'double',
        image1: '/images/musculo-orbicular-da-boca.png',
        image2: '/images/fossas-incisivas-da-maxila-e-da-mandibula.png',
        anatomicalAccident: { title: 'Fossas incisivas da maxila e da mandíbula' },
    },

];
