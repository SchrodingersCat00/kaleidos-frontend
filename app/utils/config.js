import EmberObject from '@ember/object';

export default EmberObject.create({
  routesAllowed: [
    'agenda.agendaitems.index',
    'print-overviews.newsletter.agendaitems',
    'print-overviews.decisions.agendaitems',
    'print-overviews.press-agenda.agendaitems',
    'print-overviews.notes.agendaitems',
    'cases.case.subcases.overview',
    'cases.case.subcases.subcase.overview',
    'cases.case.subcases.subcase.documenten',
    'agenda.agendaitems.agendaitem',
  ],
  phasesCodes: [
    {
      label: 'principiële goedkeuring',
    },
  ],
  alphabet: [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
  ],
  OCCaseTypeID: '6f771654-a8be-43e6-9fe5-7e17fed1cb9a',
  VRCaseTypeID: 'c3edbd53-db3b-42d8-a18d-75b8a53ba741',
  preparationSubcaseTypeId: '343e05e1-24ca-4cfb-8708-048011c2b741',
  approvalSubcaseTypeId: '7b90b3a6-2787-4b41-8a1d-886fc5abbb33',
  resultSubcaseName: '1ste principiële goedkeuring',
  principalApprovalId: '7b90b3a6-2787-4b41-8a1d-886fc5abbb33',
  onAgendaCodeId: '3e6dba4f-5c3c-439a-993e-92348ec73642',
  decidedCodeId: '4ea2c010-06c0-4594-966b-2cb9ed1e07b7',
  onAgendaLabel: 'geagendeerd',
  decidedLabel: 'beslist',
  notaID: '9e5b1230-f3ad-438f-9c68-9d7b1b2d875d',
  decisionDocumentTypeId: '2b73f8e2-b1f8-4cbd-927f-30c91759f08b',
  minuteDocumentTypeId: 'e149294e-a8b8-4c11-83ac-6d4c417b079b',
  remarkId: '305E9678-8106-4C14-9BD6-60AE2032D794',
  formallyOkOptions: [
    {
      label: 'Formeel OK',
      uri:
        'http://kanselarij.vo.data.gift/id/concept/goedkeurings-statussen/CC12A7DB-A73A-4589-9D53-F3C2F4A40636',
      classNames: 'vlc-agenda-items-new__status vlc-agenda-items-new__status--positive',
      approved: true,
      pillClassNames: 'vlc-pill vlc-pill--success',
    },
    {
      label: 'Formeel niet OK',
      uri:
        'http://kanselarij.vo.data.gift/id/concept/goedkeurings-statussen/92705106-4A61-4C30-971A-55532633A9D6',
      classNames: 'vlc-agenda-items-new__status vl-u-text--error',
      pillClassNames: 'vlc-pill vlc-pill--error',
    },
    {
      label: 'Nog niet formeel OK',
      uri:
        'http://kanselarij.vo.data.gift/id/concept/goedkeurings-statussen/B72D1561-8172-466B-B3B6-FCC372C287D0',
      classNames: 'vlc-agenda-items-new__status',
      pillClassNames: 'vlc-pill',
    },
  ],
  defaultKindUri:
    'http://kanselarij.vo.data.gift/id/concept/ministerraad-type-codes/A5D6B7A8-2F9C-44B6-B3BE-98D80B426254',
  kinds: [
    {
      label: 'Ministerraad',
      uri: 'http://kanselarij.vo.data.gift/id/concept/ministerraad-type-codes/A5D6B7A8-2F9C-44B6-B3BE-98D80B426254',
    },
    {
      label: 'Elektronische procedure',
      uri: 'http://kanselarij.vo.data.gift/id/concept/ministerraad-type-codes/406F2ECA-524D-47DC-B889-651893135456',
    },
    {
      label: 'Bijzondere ministerraad',
      uri: 'http://kanselarij.vo.data.gift/id/concept/ministerraad-type-codes/7D8E35BE-E5D1-494F-B5F9-51B07875B96F',
    },
  ],
  notYetFormallyOk:
    'http://kanselarij.vo.data.gift/id/concept/goedkeurings-statussen/B72D1561-8172-466B-B3B6-FCC372C287D0',
  formallyNok:
    'http://kanselarij.vo.data.gift/id/concept/goedkeurings-statussen/92705106-4A61-4C30-971A-55532633A9D6',
  formallyOk:
    'http://kanselarij.vo.data.gift/id/concept/goedkeurings-statussen/CC12A7DB-A73A-4589-9D53-F3C2F4A40636',

  names: {
    1: '',
    2: 'bis',
    3: 'ter',
    4: 'quater',
    5: 'quinquies',
    6: 'sexies',
    7: 'septies',
    8: 'octies',
    9: 'novies',
    10: 'decies',
    11: 'undecies',
    12: 'duodecies',
    13: 'ter decies',
    14: 'quater decies',
    15: 'quindecies',
  },
});
