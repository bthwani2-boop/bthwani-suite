// P0-06: Ops↔captain messaging workspace — preview thread UI.
// Authority: control-panel/support owns this channel. Captain sees handoff/delivery/PoD context only.
// Forbidden: captain escalation must not bypass control-panel; no financial mutation from this surface.
import React from 'react';
import { Box, Button, Chip, Surface, Text, TextField } from '@bthwani/ui-kit';
import styles from '../shared/control-panel-surface.module.css';
import { DSH_DEMO_SUPPORT_TICKETS, type DshSupportTicketMessage } from '../../shared/operations-support.preview';

const DEMO_TICKET = DSH_DEMO_SUPPORT_TICKETS[2]; // captain/delivery-linked demo ticket

function OpsMessageBubble({ message }: { message: DshSupportTicketMessage }) {
  const isOps = message.senderKind === 'ops';
  if (message.isSystem) {
    return (
      <Text role="caption" tone="muted" style={{ textAlign: 'center' }}>
        {`— ${message.body} · ${message.timestampLabel} —`}
      </Text>
    );
  }

  return (
    <Box gap={1}>
      <Box style={{ flexDirection: 'row', alignItems: 'center', gap: 4, justifyContent: isOps ? 'flex-start' : 'flex-end' }}>
        <Text role="caption" tone="muted">{message.senderLabel}</Text>
        <Text role="caption" tone="muted">·</Text>
        <Text role="caption" tone="muted">{message.timestampLabel}</Text>
      </Box>
      <Box style={{ alignItems: isOps ? 'flex-start' : 'flex-end' }}>
        <Surface
          tone={isOps ? 'inset' : 'raised'}
          padding={2}
          gap={0}
          style={{ maxWidth: '75%' }}
        >
          <Text role="bodySm">{message.body}</Text>
        </Surface>
      </Box>
    </Box>
  );
}

export type OpsCaptainMessagingWorkspaceProps = {
  captainId?: string;
  captainName?: string;
  orderId?: string;
};

export function OpsCaptainMessagingWorkspace({
  captainId = '—',
  captainName,
  orderId,
}: OpsCaptainMessagingWorkspaceProps) {
  const [draft, setDraft] = React.useState('');
  const resolvedCaptainName = captainName ?? DEMO_TICKET.actorName;
  const resolvedOrderId = orderId ?? DEMO_TICKET.entityId;
  const messages = DEMO_TICKET.messagesPreview;

  return (
    <div className={styles.surfaceCockpit}>
      <header className={styles.surfaceTopBar}>
        <div className={styles.surfaceTitleBlock}>
          <Box gap={0}>
            <div className={styles.surfaceHeaderTextRow}>
              <h1 className={styles.surfaceHeaderTitle}>محادثة مع الكابتن</h1>
              <Box paddingX={1} paddingY={0} background="brandSurface" radiusToken="xs">
                <span className={styles.surfaceHeaderBadgeTextInverse}>أوبريشن ↔ كابتن</span>
              </Box>
            </div>
            <p className={styles.surfaceHeaderSubtitle}>
              {resolvedCaptainName} — {captainId}
              {resolvedOrderId ? ` — طلب ${resolvedOrderId}` : ''}
            </p>
          </Box>
        </div>
      </header>
      <main className={styles.surfaceMainPanel}>
        <div className={styles.surfaceInnerScroll}>
          <Box padding={4} gap={4}>
            {/* Context strip */}
            <Box style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              <Chip label={DEMO_TICKET.ticketCode} tone="brand" />
              <Chip label={`SLA: ${DEMO_TICKET.slaLabel}`} tone="default" />
              <Chip label="handoff / توصيل / إثبات" />
            </Box>

            {/* Boundary note */}
            <Surface tone="inset" padding={2} gap={1}>
              <Text role="caption" tone="muted">
                الكابتن يرى حالات الـ handoff والتسليم والإثبات فقط. أي تصعيد يمر عبر control-panel — لا مسار مباشر خارج هذا الصف.
              </Text>
            </Surface>

            {/* Message thread */}
            <Surface tone="default" padding={3} gap={3}>
              <Text role="titleSm">سجل المحادثة</Text>
              <Text role="caption" tone="muted">
                {`${messages.length} رسائل · الأدلة والمرفقات تُفتح عند الطلب فقط.`}
              </Text>
              <Box gap={3}>
                {messages.map((msg) => (
                  <OpsMessageBubble key={msg.id} message={msg} />
                ))}
              </Box>
            </Surface>

            {/* Compose area — preview-only */}
            <Surface tone="inset" padding={3} gap={3}>
              <Text role="titleSm">إرسال رسالة</Text>
              <TextField
                label="رسالة للكابتن"
                value={draft}
                onChangeText={setDraft}
                placeholder="اكتب تحديثًا موجزًا مرتبطًا بالـ handoff أو التسليم أو الإثبات..."
              />
              <Box style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
                <Button
                  label="إرسال"
                  disabled
                  onPress={undefined}
                />
                <Button
                  label="تصعيد للدعم"
                  tone="secondary"
                  disabled
                  onPress={undefined}
                />
              </Box>
              <Text role="caption" tone="muted">
                الإرسال الفعلي يتطلب ربط مسار المراسلة. هذه مساحة معاينة فقط.
              </Text>
            </Surface>
          </Box>
        </div>
      </main>
    </div>
  );
}

export default OpsCaptainMessagingWorkspace;
