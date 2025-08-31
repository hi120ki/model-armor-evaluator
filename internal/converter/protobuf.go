package converter

import (
	modelarmorpb "cloud.google.com/go/modelarmor/apiv1/modelarmorpb"
	pb "github.com/hi120ki/model-armor-evaluator/gen/evaluate/v1"
)

func ConvertFilterResult(state modelarmorpb.FilterMatchState) pb.FilterMatchState {
	switch state {
	case modelarmorpb.FilterMatchState_FILTER_MATCH_STATE_UNSPECIFIED:
		return pb.FilterMatchState_FILTER_MATCH_STATE_UNSPECIFIED
	case modelarmorpb.FilterMatchState_MATCH_FOUND:
		return pb.FilterMatchState_FILTER_MATCH_STATE_MATCH_FOUND
	case modelarmorpb.FilterMatchState_NO_MATCH_FOUND:
		return pb.FilterMatchState_FILTER_MATCH_STATE_NO_MATCH_FOUND
	default:
		return pb.FilterMatchState_FILTER_MATCH_STATE_UNSPECIFIED
	}
}

// ConvertFilterResults converts Google Cloud Model Armor FilterResults to our protobuf FilterResult
func ConvertFilterResults(filterResults map[string]*modelarmorpb.FilterResult) map[string]*pb.FilterResult {
	if filterResults == nil {
		return nil
	}

	result := make(map[string]*pb.FilterResult)
	for filterName, filterResult := range filterResults {
		if filterResult == nil {
			continue
		}

		pbFilterResult := &pb.FilterResult{}

		// Handle different filter result types
		switch v := filterResult.FilterResult.(type) {
		case *modelarmorpb.FilterResult_RaiFilterResult:
			if v.RaiFilterResult != nil {
				pbFilterResult.FilterResult = &pb.FilterResult_RaiFilterResult{
					RaiFilterResult: ConvertFilterResult(v.RaiFilterResult.MatchState),
				}
			}
		case *modelarmorpb.FilterResult_SdpFilterResult:
			if v.SdpFilterResult != nil {
				// For SDP, we need to check the specific result type
				switch sdpResult := v.SdpFilterResult.Result.(type) {
				case *modelarmorpb.SdpFilterResult_InspectResult:
					if sdpResult.InspectResult != nil {
						pbFilterResult.FilterResult = &pb.FilterResult_SdpFilterResult{
							SdpFilterResult: ConvertFilterResult(sdpResult.InspectResult.MatchState),
						}
					}
				case *modelarmorpb.SdpFilterResult_DeidentifyResult:
					if sdpResult.DeidentifyResult != nil {
						pbFilterResult.FilterResult = &pb.FilterResult_SdpFilterResult{
							SdpFilterResult: ConvertFilterResult(sdpResult.DeidentifyResult.MatchState),
						}
					}
				}
			}
		case *modelarmorpb.FilterResult_PiAndJailbreakFilterResult:
			if v.PiAndJailbreakFilterResult != nil {
				pbFilterResult.FilterResult = &pb.FilterResult_PiAndJailbreakFilterResult{
					PiAndJailbreakFilterResult: ConvertFilterResult(v.PiAndJailbreakFilterResult.MatchState),
				}
			}
		case *modelarmorpb.FilterResult_MaliciousUriFilterResult:
			if v.MaliciousUriFilterResult != nil {
				pbFilterResult.FilterResult = &pb.FilterResult_MaliciousUriFilterResult{
					MaliciousUriFilterResult: ConvertFilterResult(v.MaliciousUriFilterResult.MatchState),
				}
			}
		case *modelarmorpb.FilterResult_CsamFilterFilterResult:
			if v.CsamFilterFilterResult != nil {
				pbFilterResult.FilterResult = &pb.FilterResult_CsamFilterFilterResult{
					CsamFilterFilterResult: ConvertFilterResult(v.CsamFilterFilterResult.MatchState),
				}
			}
		case *modelarmorpb.FilterResult_VirusScanFilterResult:
			if v.VirusScanFilterResult != nil {
				pbFilterResult.FilterResult = &pb.FilterResult_VirusScanFilterResult{
					VirusScanFilterResult: ConvertFilterResult(v.VirusScanFilterResult.MatchState),
				}
			}
		}

		result[filterName] = pbFilterResult
	}

	return result
}

// ConvertRaiFilterTypeResults converts Google Cloud Model Armor RAI filter type results to our protobuf format
func ConvertRaiFilterTypeResults(sanitizationResult *modelarmorpb.SanitizationResult) map[string]*pb.RaiFilterTypeResult {
	if sanitizationResult == nil || sanitizationResult.FilterResults == nil {
		return nil
	}

	// Look for RAI filter result in the filter results
	raiFilterResult, exists := sanitizationResult.FilterResults["rai"]
	if !exists || raiFilterResult == nil {
		return nil
	}

	raiResult := raiFilterResult.GetRaiFilterResult()
	if raiResult == nil || raiResult.RaiFilterTypeResults == nil {
		return nil
	}

	result := make(map[string]*pb.RaiFilterTypeResult)
	for filterTypeName, raiFilterTypeResult := range raiResult.RaiFilterTypeResults {
		if raiFilterTypeResult == nil {
			continue
		}

		pbRaiFilterTypeResult := &pb.RaiFilterTypeResult{
			FilterType:      ConvertRaiFilterType(raiFilterTypeResult.FilterType),
			ConfidenceLevel: ConvertDetectionConfidenceLevel(raiFilterTypeResult.ConfidenceLevel),
			MatchState:      ConvertFilterResult(raiFilterTypeResult.MatchState),
		}

		result[filterTypeName] = pbRaiFilterTypeResult
	}

	return result
}

// ConvertRaiFilterType converts Google Cloud Model Armor RaiFilterType to our protobuf enum
func ConvertRaiFilterType(filterType modelarmorpb.RaiFilterType) pb.RaiFilterType {
	switch filterType {
	case modelarmorpb.RaiFilterType_RAI_FILTER_TYPE_UNSPECIFIED:
		return pb.RaiFilterType_RAI_FILTER_TYPE_UNSPECIFIED
	case modelarmorpb.RaiFilterType_SEXUALLY_EXPLICIT:
		return pb.RaiFilterType_RAI_FILTER_TYPE_SEXUALLY_EXPLICIT
	case modelarmorpb.RaiFilterType_HATE_SPEECH:
		return pb.RaiFilterType_RAI_FILTER_TYPE_HATE_SPEECH
	case modelarmorpb.RaiFilterType_HARASSMENT:
		return pb.RaiFilterType_RAI_FILTER_TYPE_HARASSMENT
	case modelarmorpb.RaiFilterType_DANGEROUS:
		return pb.RaiFilterType_RAI_FILTER_TYPE_DANGEROUS
	default:
		return pb.RaiFilterType_RAI_FILTER_TYPE_UNSPECIFIED
	}
}

// ConvertDetectionConfidenceLevel converts Google Cloud Model Armor DetectionConfidenceLevel to our protobuf enum
func ConvertDetectionConfidenceLevel(level modelarmorpb.DetectionConfidenceLevel) pb.DetectionConfidenceLevel {
	switch level {
	case modelarmorpb.DetectionConfidenceLevel_DETECTION_CONFIDENCE_LEVEL_UNSPECIFIED:
		return pb.DetectionConfidenceLevel_DETECTION_CONFIDENCE_LEVEL_UNSPECIFIED
	case modelarmorpb.DetectionConfidenceLevel_LOW_AND_ABOVE:
		return pb.DetectionConfidenceLevel_DETECTION_CONFIDENCE_LEVEL_LOW_AND_ABOVE
	case modelarmorpb.DetectionConfidenceLevel_MEDIUM_AND_ABOVE:
		return pb.DetectionConfidenceLevel_DETECTION_CONFIDENCE_LEVEL_MEDIUM_AND_ABOVE
	case modelarmorpb.DetectionConfidenceLevel_HIGH:
		return pb.DetectionConfidenceLevel_DETECTION_CONFIDENCE_LEVEL_HIGH
	default:
		return pb.DetectionConfidenceLevel_DETECTION_CONFIDENCE_LEVEL_UNSPECIFIED
	}
}
