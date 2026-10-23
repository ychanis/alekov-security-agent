// 이 파일은 학생이 같은 프로젝트에서 이어서 구현합니다.
// 제공 UI를 받은 것만으로 단계 완료를 인정하지 않습니다.
export function createStudentView() {
  return {
    renderIdentity({ me, devices, sessions }) {
      const root = document.createElement('div');
      const deviceLabels = {
        compliant: '보안 기준 충족', noncompliant: '보안 기준 미충족', unknown: '확인 불가',
      };
      const sessionLabels = {
        active: '활성', expired: '만료', revoked: '철회됨', unknown: '확인 불가',
      };
      const modeLabels = { demo: '예제 자료', disconnected: '연결 없음', unknown: '확인 불가' };
      const value = (input) => input == null || input === '' ? '확인 불가' : String(input);
      const line = (parent, text) => {
        const node = document.createElement('p');
        node.textContent = text;
        parent.appendChild(node);
      };
      const deviceLine = (parent, device) => {
        line(parent, `기기: ${value(device?.label)} · ID: ${value(device?.id)} · 상태: ${deviceLabels[device?.status] || '확인 불가'}(${value(device?.status)})`);
      };
      const sessionLine = (parent, session) => {
        line(parent, `세션 ID: ${value(session?.id)} · 상태: ${sessionLabels[session?.status] || '확인 불가'}(${value(session?.status)})`);
      };
      const resourceSection = (title, resource, renderData) => {
        const section = document.createElement('section');
        const heading = document.createElement('h3');
        heading.textContent = title;
        section.appendChild(heading);
        // 모드 안내는 loading/error 상태에서도 생략하지 않습니다.
        const mode = modeLabels[resource?.mode];
        if (mode) line(section, mode);
        if (resource?.status === 'loading') {
          line(section, '불러오는 중');
        } else if (resource?.status === 'error') {
          line(section, `연결 실패: ${value(resource.error?.message)}`);
        } else if (resource?.status === 'ok') {
          renderData(section, resource.data);
        } else {
          line(section, '확인 불가');
        }
        root.appendChild(section);
      };
      resourceSection('현재 사용자·기기·세션', me, (section, data) => {
        line(section, `사용자: ${value(data?.user?.label)} · ID: ${value(data?.user?.id)}`);
        deviceLine(section, data?.device);
        sessionLine(section, data?.session);
      });
      resourceSection('기기 목록', devices, (section, data) => {
        if (!Array.isArray(data)) return line(section, '확인 불가');
        if (data.length === 0) return line(section, '표시할 기기가 없습니다.');
        for (const device of data) deviceLine(section, device);
      });
      resourceSection('세션 목록', sessions, (section, data) => {
        if (!Array.isArray(data)) return line(section, '확인 불가');
        if (data.length === 0) return line(section, '표시할 세션이 없습니다.');
        for (const session of data) sessionLine(section, session);
      });
      // 호출마다 새 DOM을 반환하며 이전 응답이나 DOM을 보관하지 않습니다.
      return root;
    },
    renderDecision({ status, mode, data, error, appId }) {
      const root = document.createElement('div');
      const line = (text) => {
        const node = document.createElement('p');
        node.textContent = text;
        root.appendChild(node);
      };
      const value = (input) => typeof input === 'string' && input.trim() ? input : '확인 불가';
      const modes = { demo: '예제 자료(demo) · 실제 연결 아님', disconnected: '연결 없음(disconnected)', unknown: '연결 상태 확인 불가(unknown)' };
      if (Object.hasOwn(modes, mode)) line(modes[mode]);
      if (status === 'idle') {
        line('요청 전(idle): 업무 앱을 골라 접근 요청을 누르세요.');
        return root;
      }
      line(`업무 앱 ID: ${value(status === 'ok' ? data?.appId ?? appId : appId)}`);
      if (status === 'loading') {
        line('판정 확인 중(loading)');
        return root;
      }
      if (status === 'error') {
        line(`요청 실패(error): ${value(error?.message)}`);
        line('요청 실패는 접근 거부 판정이 아닙니다. 접근 허용 여부를 확인할 수 없습니다.');
        return root;
      }
      if (status !== 'ok') {
        line('판정 확인 불가(unknown). 접근 허용으로 간주하지 마세요.');
        return root;
      }
      const labels = {
        allow: '접근 허용(allow)',
        deny: '접근 거부(deny)',
        challenge: '추가 인증 또는 확인 필요(challenge)',
        unknown: '판정 확인 불가(unknown)',
      };
      const decision = typeof data?.decision === 'string' && Object.hasOwn(labels, data.decision) ? data.decision : 'unknown';
      line(labels[decision]);
      line(`판정 이유(reason): ${value(data?.reason)}`);
      line(`판정 시각(checkedAt): ${value(data?.checkedAt)}`);
      if (decision === 'allow') line('정책상 접근 허용이며 실제 앱 접속 성공을 보장하지 않습니다.');
      if (decision === 'challenge') line('이 앱은 추가 인증이나 확인 절차를 대신 수행하지 않습니다.');
      if (decision === 'unknown') line('접근 판정을 확인할 수 없습니다. 접근 허용으로 간주하지 마세요.');
      return root;
    },
    renderEvents({ status, mode, data, error }) {
      const root = document.createElement('div');
      const add = (parent, tag, text) => {
        const node = document.createElement(tag);
        if (text !== undefined) node.textContent = text;
        parent.appendChild(node);
        return node;
      };
      const value = (input) =>
        input == null || input === '' ? '확인 불가' : String(input);
      const kindText = (kind) => {
        const labels = { access: '접속 기록', xdr: 'XDR 경보' };
        return `${labels[kind] || '종류 확인 불가'}(${value(kind)})`;
      };
      const accessLabels = {
        allowed: '접근 허용', denied: '접근 거부', unknown: '확인 불가',
      };
      const sessionLabels = {
        active: '활성', expired: '만료', revoked: '철회됨', unknown: '확인 불가',
      };
      const deviceLabels = {
        compliant: '보안 기준 충족',
        noncompliant: '보안 기준 미충족',
        unknown: '확인 불가',
      };
      const stateText = (labels, code) =>
        `${Object.hasOwn(labels, code) ? labels[code] : '확인 불가'}(${value(code)})`;
      const appText = (appId) =>
        appId == null || appId === '' ? '앱 확인 불가' : String(appId);
      const modes = {
        demo: '예제 자료(demo) · 실제 연결 아님',
        disconnected: '연결 없음(disconnected)',
        unknown: '연결 상태 확인 불가(unknown)',
      };
      if (Object.hasOwn(modes, mode)) add(root, 'p', modes[mode]);

      // 호출마다 새 목록과 상세 영역을 만들어 이전 선택을 보관하지 않습니다.
      if (status === 'CONTRACT_MISMATCH' ||
          error?.code === 'CONTRACT_MISMATCH') {
        add(root, 'p', '기록 확인 불가(CONTRACT_MISMATCH): 입력 계약이 일치하지 않습니다.');
        if (error?.message) add(root, 'p', String(error.message));
        return root;
      }
      if (status === 'error') {
        add(root, 'p', `기록을 불러오지 못했습니다: ${value(error?.message)}`);
        return root;
      }
      if (status === 'loading') {
        add(root, 'p', '기록을 불러오는 중입니다(loading).');
        return root;
      }
      if (status === 'idle') {
        add(root, 'p', '기록 조회 전(idle)입니다.');
        return root;
      }
      if (status !== 'ok' || !Array.isArray(data)) {
        add(root, 'p', '기록 확인 불가: 상태 또는 기록 배열을 확인할 수 없습니다.');
        return root;
      }

      // 받은 배열을 복사한 뒤 정렬하며 원본 기록은 변경하지 않습니다.
      const timestamp = (at) => {
        const time = Date.parse(at);
        return Number.isNaN(time) ? -Infinity : time;
      };
      const events = [...data].sort((a, b) => {
        const left = timestamp(a.at);
        const right = timestamp(b.at);
        return left === right ? 0 : left > right ? -1 : 1;
      });

      if (events.length === 0) {
        add(root, 'p', '표시할 기록이 없습니다');
        return root;
      }

      const filters = add(root, 'div');
      const makeFilter = (name, values, describe) => {
        const label = add(filters, 'label');
        add(label, 'span', `${name} `);
        const select = add(label, 'select');
        select.setAttribute('aria-label', name);
        const all = add(select, 'option', '전체');
        all.value = 'all';
        for (const original of new Set(values)) {
          if (original == null) continue;
          const option = add(select, 'option', describe(original));
          option.value = original;
        }
        return select;
      };
      const kindFilter = makeFilter(
        '기록 종류', events.map((event) => event.kind), kindText
      );
      const appFilter = makeFilter(
        '업무 앱', events.map((event) => event.appId), appText
      );
      const accessFilter = makeFilter(
        '접속 상태', events.map((event) => event.state?.access),
        (code) => stateText(accessLabels, code)
      );
      const count = add(root, 'p');
      const list = add(root, 'div');
      const detail = add(root, 'section');
      detail.setAttribute('aria-label', '기록 상세');

      const showDetail = (event) => {
        detail.replaceChildren();
        detail.setAttribute('data-student-event-detail', event.id);
        add(detail, 'h3', `${event.id} 상세`);
        add(detail, 'p', `사건 ID: ${value(event.id)}`);
        add(detail, 'p', `업무 앱 ID: ${appText(event.appId)}`);

        const showItems = (title, items) => {
          const section = add(detail, 'section');
          add(section, 'h4', title);
          if (!Array.isArray(items) || items.length === 0) {
            add(section, 'p', `제공된 ${title}가 없습니다.`);
            return;
          }
          const entries = add(section, 'ul');
          for (const item of items) {
            add(entries, 'li', `ID: ${value(item.id)} · 내용: ${value(item.text)}`);
          }
        };
        showItems('근거(evidence)', event.evidence);
        showItems('규칙(rules)', event.rules);
        add(detail, 'h4', '상태');
        add(detail, 'p', `접속 상태(state.access): ${stateText(accessLabels, event.state?.access)}`);
        add(detail, 'p', `세션 상태(state.session): ${stateText(sessionLabels, event.state?.session)}`);
        add(detail, 'p', `기기 상태(state.device): ${stateText(deviceLabels, event.state?.device)}`);
        // 15단계에서는 supportedActions에 관계없이 조치 버튼을 만들지 않습니다.
      };

      const drawList = () => {
        list.replaceChildren();
        detail.replaceChildren();
        detail.removeAttribute('data-student-event-detail');
        const filtered = events.filter((event) =>
          (kindFilter.value === 'all' || event.kind === kindFilter.value) &&
          (appFilter.value === 'all' || event.appId === appFilter.value) &&
          (accessFilter.value === 'all' ||
            event.state?.access === accessFilter.value)
        );
        count.textContent = `표시 기록: ${filtered.length}건 / 받은 기록: ${events.length}건`;
        if (filtered.length === 0) {
          add(list, 'p', '표시할 기록이 없습니다');
          return;
        }
        for (const event of filtered) {
          const row = add(list, 'article');
          row.setAttribute('data-student-event-id', event.id);
          add(row, 'p', `사건 ID: ${value(event.id)}`);
          add(row, 'p', `시각: ${value(event.at)}`);
          add(row, 'p', `종류: ${kindText(event.kind)}`);
          add(row, 'p', `업무 앱 ID: ${appText(event.appId)}`);
          add(row, 'p', `요약: ${value(event.summary)}`);
          const button = add(row, 'button', `${event.id} 상세`);
          button.type = 'button';
          button.addEventListener('click', () => showDetail(event));
        }
      };
      for (const select of [kindFilter, appFilter, accessFilter]) {
        select.addEventListener('change', drawList);
      }
      drawList();
      return root;
    },
    renderStatus() { return '학생 구현 대기: 기기·세션·알림과 연결 점검 상태를 구분하세요.'; },
    renderVulnerabilities() { return '학생 구현 대기: 정확한 설치 버전·OSV 출처·조회 시각·부분 결과·조회 실패를 구분하세요.'; },
    renderAiConnection() { return '학생 구현 대기: 모델 응답 점검과 실제 사건 설명을 구분하고 AI 오류·취소·수동 복구를 안내하세요.'; },
    renderExplanation() { return '학생 구현 대기: 선택한 사건의 근거·규칙·현재 상태와 AI 설명을 연결하세요. 제안은 자동 실행하지 않습니다.'; },
    renderAction() { return '학생 구현 대기: 현재 사건·조치·실제 대상·사람 확인·ACK와 원천 효과·unknown을 구분하세요.'; },
  };
}

