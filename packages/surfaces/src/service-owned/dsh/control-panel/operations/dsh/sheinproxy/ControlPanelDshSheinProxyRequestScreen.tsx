'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Card,
  KeyValueList,
  StateView,
  Tabs,
  Text,
  TextField,
} from '@bthwani/ui-kit';
import {
  WebMissionHeroCard,
  WebPageFrame,
  WebSectionCard,
  WebSignalCard,
} from '@bthwani/ui-kit/web';
import { useDshControlPanelText } from '../shared/dshControlPanelText';

type AssignmentFamily = 'shein' | 'awnak' | 'generic';
type AssignmentMode = 'now' | 'scheduled';
type AssignmentStage = 'detail' | 'estimate' | 'offer' | 'schedule';
type ManualAssignmentScreenState = 'ready' | 'loading' | 'empty' | 'offline' | 'disabled' | 'error';

export type ControlPanelDshSheinProxyRequestScreenProps = {
  requestId: string;
  stage: AssignmentStage;
  state?: ManualAssignmentScreenState;
  listHref?: string;
  hubHref?: string;
  operationsHref?: string;
  supportHref?: string;
  embedded?: boolean;
  showHeader?: boolean;
};

const familyOptions: Array<{ value: AssignmentFamily; label: string; description: string }> = [
  { value: 'shein', label: 'SHEIN', description: 'منصة شراء وتجميع تابعة للمنصة نفسها.' },
  { value: 'awnak', label: 'عونك', description: 'توصيل يدوي عام من العمليات.' },
  { value: 'generic', label: 'أخرى', description: 'قالب عام لأي فئة جديدة لاحقًا.' },
];

const modeOptions: Array<{ value: AssignmentMode; label: string }> = [
  { value: 'now', label: 'الآن' },
  { value: 'scheduled', label: 'لاحقًا' },
];

function resolveStateCopy(
  text: ReturnType<typeof useDshControlPanelText>,
  state: Exclude<ManualAssignmentScreenState, 'ready'>,
) {
  if (state === 'loading') {
    return {
      stateId: 'loading' as const,
      title: 'Preparing manual assignment',
      description: 'The general assignment form is loading and keeps the safe exit visible.',
      actionLabel: text.sheinProxy.retryLabel,
    };
  }

  if (state === 'empty') {
    return {
      stateId: 'empty' as const,
      title: 'No assignment selected',
      description: 'Pick a preset or return to the operations queue.',
      actionLabel: text.sheinProxy.backToHub,
    };
  }

  if (state === 'offline') {
    return {
      stateId: 'offline' as const,
      title: 'Connection unavailable',
      description: 'The form stays explicit even when the route is paused.',
      actionLabel: text.sheinProxy.retryLabel,
    };
  }

  if (state === 'disabled') {
    return {
      kind: 'warning' as const,
      title: 'Manual assignment is not enabled yet',
      description: 'This slice is ready for the general form but execution stays out of scope.',
      actionLabel: text.sheinProxy.backToHub,
    };
  }

  return {
    stateId: 'recoverableError' as const,
    title: 'Unable to load manual assignment',
    description: 'Try again or return to the list without leaving the operations lane.',
    actionLabel: text.sheinProxy.retryLabel,
  };
}

function resolveStageMeta(stage: AssignmentStage) {
  if (stage === 'estimate') {
    return { label: 'Estimate', description: 'Review the cost assumptions before assignment.' };
  }

  if (stage === 'offer') {
    return { label: 'Offer', description: 'The batch is ready for confirmation or review.' };
  }

  if (stage === 'schedule') {
    return { label: 'Schedule', description: 'Lock the pickup or delivery window.' };
  }

  return { label: 'Detail', description: 'Review the assignment payload and route scope.' };
}

export function ControlPanelDshSheinProxyRequestScreen({
  requestId,
  stage,
  state = 'ready',
  listHref = '/operations/dsh/sheinproxy',
  hubHref = '/operations/dsh',
  operationsHref = '/operations',
  supportHref = '/support',
  embedded = false,
  showHeader = true,
}: ControlPanelDshSheinProxyRequestScreenProps) {
  const router = useRouter();
  const dshText = useDshControlPanelText();
  const [family, setFamily] = React.useState<AssignmentFamily>('shein');
  const [assignmentReference, setAssignmentReference] = React.useState(requestId);
  const [pickupNode, setPickupNode] = React.useState('Operations intake');
  const [dropoffNode, setDropoffNode] = React.useState('Customer delivery route');
  const [customerCount, setCustomerCount] = React.useState('1');
  const [captainCount, setCaptainCount] = React.useState('1');
  const [mode, setMode] = React.useState<AssignmentMode>(stage === 'schedule' ? 'scheduled' : 'now');
  const [scheduleDate, setScheduleDate] = React.useState('');
  const [scheduleTime, setScheduleTime] = React.useState('');
  const [notes, setNotes] = React.useState('');
  const [draftSaved, setDraftSaved] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [validationError, setValidationError] = React.useState<string | null>(null);

  const stageMeta = resolveStageMeta(stage);
  const resolvedState = state;

  const validate = () => {
    const normalizedReference = assignmentReference.trim();
    const normalizedPickup = pickupNode.trim();
    const normalizedDropoff = dropoffNode.trim();
    const parsedCustomers = Number(customerCount.trim());
    const parsedCaptains = Number(captainCount.trim());

    if (!normalizedReference || !normalizedPickup || !normalizedDropoff) {
      setValidationError('املأ المرجع ونقطة الاستلام ونقطة التسليم أولًا.');
      return false;
    }

    if (Number.isNaN(parsedCustomers) || parsedCustomers < 1) {
      setValidationError('عدد العملاء يجب أن يكون رقمًا يبدأ من 1.');
      return false;
    }

    if (Number.isNaN(parsedCaptains) || parsedCaptains < 1) {
      setValidationError('عدد الكباتن يجب أن يكون رقمًا يبدأ من 1.');
      return false;
    }

    if (mode === 'scheduled' && (!scheduleDate.trim() || !scheduleTime.trim())) {
      setValidationError('اختر التاريخ والوقت عند التنفيذ لاحقًا.');
      return false;
    }

    setValidationError(null);
    return true;
  };

  const handleSaveDraft = () => {
    if (!assignmentReference.trim()) {
      setValidationError('أضف مرجعًا للاستمارة قبل الحفظ.');
      return;
    }

    setValidationError(null);
    setDraftSaved(true);
  };

  const handleSubmit = () => {
    if (!validate()) {
      return;
    }

    setSubmitted(true);
  };

  const summaryItems = [
    { label: 'Family', value: family.toUpperCase() },
    { label: 'Reference', value: assignmentReference || 'Pending' },
    { label: 'Customers', value: customerCount },
    { label: 'Captains', value: captainCount },
    { label: 'Mode', value: mode === 'now' ? 'Now' : 'Scheduled' },
    { label: 'Step', value: stageMeta.label },
  ];

  if (resolvedState !== 'ready') {
    return (
      <WebPageFrame
        eyebrow='DSH / operations / assignment'
        title='Manual assignment'
        description='A general operations form for SHEIN, Awnak, or any other platform-owned delivery family.'
        maxWidth={1120}
        embedded={embedded}
        showHeader={showHeader}
      >
        <StateView
          {...resolveStateCopy(dshText, resolvedState)}
          onActionPress={() => {
            if (resolvedState === 'loading' || resolvedState === 'offline' || resolvedState === 'error') {
              router.refresh();
              return;
            }

            router.push(listHref);
          }}
        />
      </WebPageFrame>
    );
  }

  return (
    <WebPageFrame
      eyebrow='DSH / operations / assignment'
      title='Manual assignment'
      description='General form for platform-owned families such as SHEIN and Awnak, with no partner dependency.'
      maxWidth={1120}
      embedded={embedded}
      showHeader={showHeader}
    >
      <Box gap={4}>
        <WebMissionHeroCard
          badges={['DSH', family.toUpperCase(), stageMeta.label]}
          eyebrow='Assignment workspace'
          title='General manual assignment'
          description='One reusable ops form for intake, batching, and captain allocation.'
          metaItems={[
            'No partner lane is required for this family.',
            `Mode: ${mode === 'now' ? 'Now' : 'Scheduled'}`,
            `Step: ${stageMeta.description}`,
          ]}
          primaryAction={{ label: 'Back to queue', href: listHref }}
          secondaryAction={{ label: 'Open operations', href: operationsHref }}
        />

        <Box layoutDirection='row' gap={2}>
          <WebSignalCard title='Families' value='3' description='SHEIN, Awnak, and generic presets.' tone='neutral' />
          <WebSignalCard title='Customers' value={customerCount || '1'} description='Customer count in this batch.' tone='best' />
          <WebSignalCard title='Captains' value={captainCount || '1'} description='Captain allocation for the route.' />
          <WebSignalCard title='Step' value={stageMeta.label} description={stageMeta.description} />
        </Box>

        <WebSectionCard title='Assignment identity' description='Pick the family preset and give this batch a stable reference.'>
          <Box gap={3}>
            <Tabs<AssignmentFamily>
              items={familyOptions}
              value={family}
              onValueChange={(value) => setFamily(value)}
              variant='pill'
            />

            <Box gap={2} layoutDirection='row' style={{ flexWrap: 'wrap' }}>
              <Box style={{ flex: 1, minWidth: 240 }}>
                <TextField label='Assignment reference' value={assignmentReference} onChangeText={setAssignmentReference} placeholder='DSH-ASSIGN-0001' />
              </Box>
              <Box style={{ flex: 1, minWidth: 240 }}>
                <TextField label='Source' value={pickupNode} onChangeText={setPickupNode} placeholder='Operations intake / hub' />
              </Box>
              <Box style={{ flex: 1, minWidth: 240 }}>
                <TextField label='Destination' value={dropoffNode} onChangeText={setDropoffNode} placeholder='Customer delivery route' />
              </Box>
            </Box>
          </Box>
        </WebSectionCard>

        <WebSectionCard title='Batch planning' description='Plan the customer grouping and captain allocation before sending the assignment.'>
          <Box gap={3}>
            <Box layoutDirection='row' gap={2}>
              <Box style={{ flex: 1, minWidth: 180 }}>
                <TextField label='Customers in batch' value={customerCount} onChangeText={setCustomerCount} keyboardType='number-pad' placeholder='1' />
              </Box>
              <Box style={{ flex: 1, minWidth: 180 }}>
                <TextField label='Captains needed' value={captainCount} onChangeText={setCaptainCount} keyboardType='number-pad' placeholder='1' />
              </Box>
            </Box>

            <Tabs<AssignmentMode>
              items={modeOptions}
              value={mode}
              onValueChange={(value) => setMode(value)}
              variant='pill'
            />

            {mode === 'scheduled' ? (
              <Box layoutDirection='row' gap={2} style={{ flexWrap: 'wrap' }}>
                <Box style={{ flex: 1, minWidth: 180 }}>
                  <TextField label='Date' value={scheduleDate} onChangeText={setScheduleDate} placeholder='YYYY-MM-DD' />
                </Box>
                <Box style={{ flex: 1, minWidth: 180 }}>
                  <TextField label='Time' value={scheduleTime} onChangeText={setScheduleTime} placeholder='HH:MM' />
                </Box>
              </Box>
            ) : null}
          </Box>
        </WebSectionCard>

        <WebSectionCard title='Operational notes' description='Use the notes field for sorting, packaging, route, or special handling instructions.'>
          <Box gap={2}>
            <TextField label='Notes' value={notes} onChangeText={setNotes} placeholder='Sorting, packaging, route, or handoff instructions' />
            {validationError ? <Text role='bodySm' tone='muted'>{validationError}</Text> : null}
            {draftSaved ? <Text role='bodySm'>Draft saved locally for this manual assignment.</Text> : null}
            {submitted ? <Text role='bodySm'>Assignment is ready for the next operations step.</Text> : null}
          </Box>
        </WebSectionCard>

        <WebSectionCard title='Assignment preview' description='The preview keeps the most important operational facts visible without duplicating the entire form.'>
          <Box gap={2}>
            <Card>
              <KeyValueList items={summaryItems} />
            </Card>
            <Card>
              <Box gap={2}>
                <Text role='bodyStrong'>No partner lane</Text>
                <Text role='bodySm' tone='muted'>Platform-owned families are purchased, sorted, and delivered by the platform itself.</Text>
                <Text role='bodySm' tone='muted'>The captain will later see a batch route, not a partner identity.</Text>
              </Box>
            </Card>
          </Box>
        </WebSectionCard>

        <Box layoutDirection='row' gap={2} style={{ flexWrap: 'wrap' }}>
          <Button label='Save draft' tone='secondary' fullWidth={false} onPress={handleSaveDraft} />
          <Button label='Assign now' tone='primary' fullWidth={false} onPress={handleSubmit} />
          <Button label='Back to list' tone='secondary' fullWidth={false} onPress={() => router.push(listHref)} />
          <Button label='Open hub' tone='ghost' fullWidth={false} onPress={() => router.push(hubHref)} />
          <Button label='Open support' tone='ghost' fullWidth={false} onPress={() => router.push(supportHref)} />
        </Box>
      </Box>
    </WebPageFrame>
  );
}

export default ControlPanelDshSheinProxyRequestScreen;
