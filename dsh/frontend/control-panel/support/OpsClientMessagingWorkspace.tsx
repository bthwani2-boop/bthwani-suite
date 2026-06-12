// P0-06: Ops↔client messaging workspace — preview thread UI.
// Authority: control-panel/support owns this channel. Messages are on-demand; no bulk history load.
// WLT boundary: any financial-impact mention is a read-only preview tag — no mutation from this surface.
import React from 'react';
import { Box, Button, Chip, Surface, Text, TextField } from '@bthwani/ui-kit';
import styles from '../shared/control-panel-surface.module.css';
type DshSupportTicketMessage = {
  id: string;
  senderKind: 'ops' | 'client' | 'captain' | 'partner';
  senderLabel: string;
  body: string;
  timestampLabel: string;
  isSystem?: boolean;
};

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

export type OpsClientMessagingWorkspaceProps = {
  clientId?: string;
  clientName?: string;
  orderId?: string;
};

export function OpsClientMessagingWorkspace({
  clientId = '—',
  clientName,
  orderId,
}: OpsClientMessagingWorkspaceProps) {
  const [draft, setDraft] = React.useState('');
  const [messages, setMessages] = React.useState<ReadonlyArray<DshSupportTicketMessage>>([]);
  const [isEscalated, setIsEscalated] = React.useState(false);

  const resolvedClientName = clientName ?? '—';
  const resolvedOrderId = orderId ?? null;

  const handleSend = () => {
    if (!draft.trim()) return;
    const newMessage: DshSupportTicketMessage = {
      id: `msg-client-custom-${Date.now()}`,
      senderKind: 'ops',
      senderLabel: 'فريق الدعم',
      body: draft.trim(),
      timestampLabel: 'الآن',
    };
    setMessages((prev) => [...prev, newMessage]);
    setDraft('');
  };

  const handleEscalate = () => {
    if (isEscalated) return;
    const newSystemMsg: DshSupportTicketMessage = {
      id: `msg-client-system-${Date.now()}`,
      senderKind: 'ops',
      senderLabel: 'النظام',
      body: 'تم تصعيد المحادثة إلى إدارة الدعم والالتزام.',
      timestampLabel: 'الآن',
      isSystem: true,
    };
    setMessages((prev) => [...prev, newSystemMsg]);
    setIsEscalated(true);
    if (typeof window !== 'undefined') {
      window.alert('سياق الحوكمة: تم تصعيد المحادثة. القرار المالي النهائي خاضع لحوكمة WLT.');
    }
  };

  return (
    <div className={styles.surfaceCockpit}>
      <header className={styles.surfaceTopBar}>
        <div className={styles.surfaceTitleBlock}>
          <Box gap={0}>
            <div className={styles.surfaceHeaderTextRow}>
              <h1 className={styles.surfaceHeaderTitle}>محادثة مع العميل</h1>
              <Box paddingX={1} paddingY={0} background="brandSurface" radiusToken="xs">
                <span className={styles.surfaceHeaderBadgeTextInverse}>أوبريشن ↔ عميل</span>
              </Box>
            </div>
            <p className={styles.surfaceHeaderSubtitle}>
              {resolvedClientName} — {clientId}
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
              <Chip label={`${DEMO_TICKET.ticketCode}`} tone="brand" />
              <Chip label={`SLA: ${DEMO_TICKET.slaLabel}`} tone={DEMO_TICKET.slaRisk === 'at-risk' ? 'warning' : 'default'} />
              <Chip label={`الصف: ${DEMO_TICKET.ownerQueue}`} />
              {isEscalated ? <Chip label="مصعد" tone="danger" /> : null}
            </Box>

            {/* Message thread */}
            <Surface tone="default" padding={3} gap={3}>
              <Text role="titleSm">سجل المحادثة</Text>
              <Text role="caption" tone="muted">
                {`${messages.length} رسائل · التفاصيل والمرفقات تُفتح عند الطلب فقط.`}
              </Text>
              <Box gap={3}>
                {messages.map((msg) => (
                  <OpsMessageBubble key={msg.id} message={msg} />
                ))}
              </Box>
            </Surface>

            {/* Compose area */}
            <Surface tone="inset" padding={3} gap={3}>
              <Text role="titleSm">إرسال رسالة</Text>
              <TextField
                label="رسالة للعميل"
                value={draft}
                onChangeText={setDraft}
                placeholder="اكتب ردًا مرتبطًا بسياق الطلب أو التذكرة..."
              />
              <Box style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
                <Button
                  label="إرسال"
                  onPress={handleSend}
                />
                <Button
                  label={isEscalated ? 'تم التصعيد' : 'تصعيد للدعم'}
                  tone="secondary"
                  disabled={isEscalated}
                  onPress={handleEscalate}
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

export default OpsClientMessagingWorkspace;
