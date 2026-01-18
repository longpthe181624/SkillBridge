package com.skillbridge.controller;

import com.skillbridge.dto.contract.request.UpdateChangeRequestRequest;
import com.skillbridge.dto.contract.response.ChangeRequestDetailDTO;
import com.skillbridge.service.contract.ChangeRequestDetailService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ClientChangeRequestDetailControllerTest {

    @Mock
    private ChangeRequestDetailService changeRequestDetailService;

    @InjectMocks
    private ClientChangeRequestDetailController controller;

    @Test
    @DisplayName("getChangeRequestDetail - success")
    void testGetChangeRequestDetail_Success() {
        ChangeRequestDetailDTO dto = new ChangeRequestDetailDTO();
        when(changeRequestDetailService.getChangeRequestDetail(1, 2, 3)).thenReturn(dto);

        ResponseEntity<?> response = controller.getChangeRequestDetail(1, 2, 3);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertSame(dto, response.getBody());
        verify(changeRequestDetailService).getChangeRequestDetail(1, 2, 3);
    }

    @Test
    @DisplayName("getChangeRequestDetail - missing user -> 401")
    void testGetChangeRequestDetail_MissingUser() {
        ResponseEntity<?> response = controller.getChangeRequestDetail(1, 2, null);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        Map<?, ?> body = (Map<?, ?>) response.getBody();
        assertNotNull(body);
        assertEquals("User ID is required", body.get("error"));
        verifyNoInteractions(changeRequestDetailService);
    }

    @Test
    @DisplayName("getChangeRequestDetail - internal error -> 500")
    void testGetChangeRequestDetail_InternalError() {
        when(changeRequestDetailService.getChangeRequestDetail(anyInt(), anyInt(), anyInt()))
                .thenThrow(new RuntimeException("detail error"));

        ResponseEntity<?> response = controller.getChangeRequestDetail(1, 2, 3);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        Map<?, ?> body = (Map<?, ?>) response.getBody();
        assertNotNull(body);
        assertEquals("detail error", body.get("error"));
        verify(changeRequestDetailService).getChangeRequestDetail(1, 2, 3);
    }

    @Test
    @DisplayName("updateChangeRequest - success")
    void testUpdateChangeRequest_Success() {
        UpdateChangeRequestRequest req = new UpdateChangeRequestRequest();

        ResponseEntity<?> response = controller.updateChangeRequest(1, 2, req, 3);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        Map<?, ?> body = (Map<?, ?>) response.getBody();
        assertEquals(true, body.get("success"));
        assertEquals("Change request updated successfully", body.get("message"));
        verify(changeRequestDetailService).updateChangeRequest(1, 2, 3, req);
    }

    @Test
    @DisplayName("updateChangeRequest - missing user -> 401")
    void testUpdateChangeRequest_MissingUser() {
        ResponseEntity<?> response = controller.updateChangeRequest(1, 2, new UpdateChangeRequestRequest(), null);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        Map<?, ?> body = (Map<?, ?>) response.getBody();
        assertEquals("User ID is required", body.get("error"));
        verifyNoInteractions(changeRequestDetailService);
    }

    @Test
    @DisplayName("updateChangeRequest - invalid state -> 400")
    void testUpdateChangeRequest_InvalidState() {
        doThrow(new IllegalStateException("not draft"))
                .when(changeRequestDetailService).updateChangeRequest(anyInt(), anyInt(), anyInt(), any());

        ResponseEntity<?> response = controller.updateChangeRequest(1, 2, new UpdateChangeRequestRequest(), 3);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        Map<?, ?> body = (Map<?, ?>) response.getBody();
        assertEquals("not draft", body.get("error"));
        verify(changeRequestDetailService).updateChangeRequest(eq(1), eq(2), eq(3), any(UpdateChangeRequestRequest.class));
    }

    @Test
    @DisplayName("updateChangeRequest - internal error -> 500")
    void testUpdateChangeRequest_InternalError() {
        doThrow(new RuntimeException("update failed"))
                .when(changeRequestDetailService).updateChangeRequest(anyInt(), anyInt(), anyInt(), any());

        ResponseEntity<?> response = controller.updateChangeRequest(1, 2, new UpdateChangeRequestRequest(), 3);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        Map<?, ?> body = (Map<?, ?>) response.getBody();
        assertEquals("update failed", body.get("error"));
        verify(changeRequestDetailService).updateChangeRequest(eq(1), eq(2), eq(3), any(UpdateChangeRequestRequest.class));
    }

    @Test
    @DisplayName("submitChangeRequest - success")
    void testSubmitChangeRequest_Success() {
        ResponseEntity<?> response = controller.submitChangeRequest(1, 2, 3);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        Map<?, ?> body = (Map<?, ?>) response.getBody();
        assertEquals(true, body.get("success"));
        assertEquals("Change request submitted successfully", body.get("message"));
        verify(changeRequestDetailService).submitChangeRequest(1, 2, 3);
    }

    @Test
    @DisplayName("submitChangeRequest - missing user -> 401")
    void testSubmitChangeRequest_MissingUser() {
        ResponseEntity<?> response = controller.submitChangeRequest(1, 2, null);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        Map<?, ?> body = (Map<?, ?>) response.getBody();
        assertEquals("User ID is required", body.get("error"));
        verifyNoInteractions(changeRequestDetailService);
    }

    @Test
    @DisplayName("submitChangeRequest - invalid state -> 400")
    void testSubmitChangeRequest_InvalidState() {
        doThrow(new IllegalStateException("bad state"))
                .when(changeRequestDetailService).submitChangeRequest(anyInt(), anyInt(), anyInt());

        ResponseEntity<?> response = controller.submitChangeRequest(1, 2, 3);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        Map<?, ?> body = (Map<?, ?>) response.getBody();
        assertEquals("bad state", body.get("error"));
        verify(changeRequestDetailService).submitChangeRequest(1, 2, 3);
    }

    @Test
    @DisplayName("submitChangeRequest - internal error -> 500")
    void testSubmitChangeRequest_InternalError() {
        doThrow(new RuntimeException("submit error"))
                .when(changeRequestDetailService).submitChangeRequest(anyInt(), anyInt(), anyInt());

        ResponseEntity<?> response = controller.submitChangeRequest(1, 2, 3);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        Map<?, ?> body = (Map<?, ?>) response.getBody();
        assertEquals("submit error", body.get("error"));
        verify(changeRequestDetailService).submitChangeRequest(1, 2, 3);
    }

    @Test
    @DisplayName("approveChangeRequest - success")
    void testApproveChangeRequest_Success() {
        ResponseEntity<?> response = controller.approveChangeRequest(1, 2, 3);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        Map<?, ?> body = (Map<?, ?>) response.getBody();
        assertEquals(true, body.get("success"));
        assertEquals("Change request approved successfully", body.get("message"));
        verify(changeRequestDetailService).approveChangeRequest(1, 2, 3);
    }

    @Test
    @DisplayName("approveChangeRequest - missing user -> 401")
    void testApproveChangeRequest_MissingUser() {
        ResponseEntity<?> response = controller.approveChangeRequest(1, 2, null);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        Map<?, ?> body = (Map<?, ?>) response.getBody();
        assertEquals("User ID is required", body.get("error"));
        verifyNoInteractions(changeRequestDetailService);
    }

    @Test
    @DisplayName("approveChangeRequest - invalid state -> 400")
    void testApproveChangeRequest_InvalidState() {
        doThrow(new IllegalStateException("cannot approve"))
                .when(changeRequestDetailService).approveChangeRequest(anyInt(), anyInt(), anyInt());

        ResponseEntity<?> response = controller.approveChangeRequest(1, 2, 3);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        Map<?, ?> body = (Map<?, ?>) response.getBody();
        assertEquals("cannot approve", body.get("error"));
        verify(changeRequestDetailService).approveChangeRequest(1, 2, 3);
    }

    @Test
    @DisplayName("approveChangeRequest - internal error -> 500")
    void testApproveChangeRequest_InternalError() {
        doThrow(new RuntimeException("approve error"))
                .when(changeRequestDetailService).approveChangeRequest(anyInt(), anyInt(), anyInt());

        ResponseEntity<?> response = controller.approveChangeRequest(1, 2, 3);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        Map<?, ?> body = (Map<?, ?>) response.getBody();
        assertEquals("approve error", body.get("error"));
        verify(changeRequestDetailService).approveChangeRequest(1, 2, 3);
    }

    @Test
    @DisplayName("requestForChange - success with message")
    void testRequestForChange_Success() {
        ResponseEntity<?> response = controller.requestForChange(1, 2, Map.of("message", "please change"), 3);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        Map<?, ?> body = (Map<?, ?>) response.getBody();
        assertEquals(true, body.get("success"));
        assertEquals("Change request status updated to Request for Change", body.get("message"));
        verify(changeRequestDetailService).requestForChange(1, 2, 3, "please change");
    }

    @Test
    @DisplayName("requestForChange - missing user -> 401")
    void testRequestForChange_MissingUser() {
        ResponseEntity<?> response = controller.requestForChange(1, 2, Map.of("message", "msg"), null);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        Map<?, ?> body = (Map<?, ?>) response.getBody();
        assertEquals("User ID is required", body.get("error"));
        verifyNoInteractions(changeRequestDetailService);
    }

    @Test
    @DisplayName("requestForChange - invalid state -> 400")
    void testRequestForChange_InvalidState() {
        doThrow(new IllegalStateException("invalid state"))
                .when(changeRequestDetailService).requestForChange(anyInt(), anyInt(), anyInt(), any());

        ResponseEntity<?> response = controller.requestForChange(1, 2, Map.of("message", "msg"), 3);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        Map<?, ?> body = (Map<?, ?>) response.getBody();
        assertEquals("invalid state", body.get("error"));
        verify(changeRequestDetailService).requestForChange(1, 2, 3, "msg");
    }

    @Test
    @DisplayName("requestForChange - internal error -> 500")
    void testRequestForChange_InternalError() {
        doThrow(new RuntimeException("request error"))
                .when(changeRequestDetailService).requestForChange(anyInt(), anyInt(), anyInt(), any());

        ResponseEntity<?> response = controller.requestForChange(1, 2, Map.of("message", "msg"), 3);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        Map<?, ?> body = (Map<?, ?>) response.getBody();
        assertEquals("request error", body.get("error"));
        verify(changeRequestDetailService).requestForChange(1, 2, 3, "msg");
    }

    @Test
    @DisplayName("requestForChange - null body passes null message")
    void testRequestForChange_NullBody() {
        ResponseEntity<?> response = controller.requestForChange(1, 2, null, 3);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(changeRequestDetailService).requestForChange(1, 2, 3, null);
    }

    @Test
    @DisplayName("terminateChangeRequest - success")
    void testTerminateChangeRequest_Success() {
        ResponseEntity<?> response = controller.terminateChangeRequest(1, 2, 3);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        Map<?, ?> body = (Map<?, ?>) response.getBody();
        assertEquals(true, body.get("success"));
        assertEquals("Change request terminated successfully", body.get("message"));
        verify(changeRequestDetailService).terminateChangeRequest(1, 2, 3);
    }

    @Test
    @DisplayName("terminateChangeRequest - missing user -> 401")
    void testTerminateChangeRequest_MissingUser() {
        ResponseEntity<?> response = controller.terminateChangeRequest(1, 2, null);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        Map<?, ?> body = (Map<?, ?>) response.getBody();
        assertEquals("User ID is required", body.get("error"));
        verifyNoInteractions(changeRequestDetailService);
    }

    @Test
    @DisplayName("terminateChangeRequest - internal error -> 500")
    void testTerminateChangeRequest_InternalError() {
        doThrow(new RuntimeException("terminate error"))
                .when(changeRequestDetailService).terminateChangeRequest(anyInt(), anyInt(), anyInt());

        ResponseEntity<?> response = controller.terminateChangeRequest(1, 2, 3);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        Map<?, ?> body = (Map<?, ?>) response.getBody();
        assertEquals("terminate error", body.get("error"));
        verify(changeRequestDetailService).terminateChangeRequest(1, 2, 3);
    }
}

