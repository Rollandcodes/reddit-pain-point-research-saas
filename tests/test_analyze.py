"""Tests for transform_to_schema in src/analyze.py."""
import pytest
from src.analyze import transform_to_schema, _infer_category, _infer_severity, _summarize


# Fixture data - small sample of Reddit-like items
FIXTURE_ITEMS = [
    {
        "title": "The pricing is way too expensive for startups",
        "selftext": "I can't believe how much they charge for such a basic feature. It's urgent that we find an alternative.",
        "subreddit": "SaaS",
        "date": "2025-01-01T10:00:00Z",
        "full_link": "https://reddit.com/r/SaaS/test1",
    },
    {
        "title": "Bug causing crashes on mobile",
        "selftext": "The app keeps crashing whenever I open the dashboard. This is a serious issue.",
        "subreddit": "startups",
        "date": "2025-01-02T11:00:00Z",
        "full_link": "https://reddit.com/r/startups/test2",
    },
    {
        "title": "Missing feature request: export to PDF",
        "selftext": "Would be nice if we could export reports to PDF format.",
        "subreddit": "ProductManagement",
        "date": "2025-01-03T12:00:00Z",
        "full_link": "https://reddit.com/r/ProductManagement/test3",
    },
    {
        "title": "Performance is slow on large datasets",
        "selftext": "Experiencing major lag when loading more than 1000 items.",
        "subreddit": "SaaS",
        "date": "2025-01-04T13:00:00Z",
        "full_link": "https://reddit.com/r/SaaS/test4",
    },
    {
        "title": "General feedback about the product",
        "selftext": "I have some thoughts about the UI design.",
        "subreddit": "startups",
        "date": "2025-01-05T14:00:00Z",
        "full_link": "https://reddit.com/r/startups/test5",
    },
]


class TestInferCategory:
    """Tests for _infer_category helper function."""

    def test_pricing_category(self):
        """Test that pricing-related keywords trigger Pricing category."""
        assert _infer_category("The price is too high") == "Pricing"
        assert _infer_category("Subscription cost is expensive") == "Pricing"

    def test_bugs_category(self):
        """Test that bug-related keywords trigger Bugs category."""
        assert _infer_category("There is a bug in the app") == "Bugs"
        assert _infer_category("The system crashed") == "Bugs"
        assert _infer_category("Everything is broken") == "Bugs"

    def test_feature_category(self):
        """Test that feature-related keywords trigger Feature category."""
        assert _infer_category("Missing export feature") == "Feature"
        assert _infer_category("Would be nice to have dark mode") == "Feature"

    def test_performance_category(self):
        """Test that performance-related keywords trigger Performance category."""
        assert _infer_category("The app is slow") == "Performance"
        assert _infer_category("Experiencing lag issues") == "Performance"

    def test_other_category(self):
        """Test that unmatched text returns Other category."""
        assert _infer_category("General thoughts on the product") == "Other"
        assert _infer_category("") == "Other"


class TestInferSeverity:
    """Tests for _infer_severity helper function."""

    def test_critical_severity(self):
        """Test that critical keywords return severity 5."""
        assert _infer_severity("This is urgent, can't use the product") == 5
        assert _infer_severity("Critical blocking issue") == 5
        assert _infer_severity("Cannot proceed with work") == 5

    def test_major_severity(self):
        """Test that major keywords return severity 4."""
        assert _infer_severity("This is a serious problem") == 4
        assert _infer_severity("Breaking change in the API") == 4

    def test_moderate_severity(self):
        """Test that moderate keywords return severity 3."""
        assert _infer_severity("This is annoying behavior") == 3
        assert _infer_severity("I'm frustrated with this") == 3

    def test_default_severity(self):
        """Test that default severity is 2."""
        assert _infer_severity("This is some feedback") == 2
        assert _infer_severity("") == 2


class TestSummarize:
    """Tests for _summarize helper function."""

    def test_short_text_unchanged(self):
        """Test that short text is returned unchanged."""
        text = "Short text"
        assert _summarize(text) == "Short text"

    def test_long_text_truncated(self):
        """Test that long text is truncated with ellipsis."""
        text = "A" * 300
        result = _summarize(text, max_chars=200)
        assert len(result) <= 203  # 200 + "..."
        assert result.endswith("...")

    def test_empty_text(self):
        """Test that empty text returns empty string."""
        assert _summarize("") == ""
        assert _summarize(None) == ""


class TestTransformToSchema:
    """Tests for transform_to_schema function."""

    def test_returns_list(self):
        """Test that transform_to_schema returns a list."""
        result = transform_to_schema(FIXTURE_ITEMS)
        assert isinstance(result, list)

    def test_correct_record_count(self):
        """Test that the correct number of records are returned."""
        result = transform_to_schema(FIXTURE_ITEMS)
        assert len(result) == len(FIXTURE_ITEMS)

    def test_schema_fields_present(self):
        """Test that all expected schema fields are present in each record."""
        expected_fields = [
            "date",
            "subreddit",
            "post_title",
            "post_url",
            "comment_or_content",
            "pain_summary",
            "category",
            "severity_rating",
            "notes",
        ]
        result = transform_to_schema(FIXTURE_ITEMS)
        for record in result:
            for field in expected_fields:
                assert field in record, f"Missing field: {field}"

    def test_pricing_item_categorization(self):
        """Test that pricing-related item is correctly categorized."""
        result = transform_to_schema([FIXTURE_ITEMS[0]])
        assert result[0]["category"] == "Pricing"
        assert result[0]["severity_rating"] == 5  # Contains "urgent" and "can't"

    def test_bug_item_categorization(self):
        """Test that bug-related item is correctly categorized."""
        result = transform_to_schema([FIXTURE_ITEMS[1]])
        assert result[0]["category"] == "Bugs"
        assert result[0]["severity_rating"] == 4  # Contains "serious"

    def test_feature_item_categorization(self):
        """Test that feature-related item is correctly categorized."""
        result = transform_to_schema([FIXTURE_ITEMS[2]])
        assert result[0]["category"] == "Feature"

    def test_performance_item_categorization(self):
        """Test that performance-related item is correctly categorized."""
        result = transform_to_schema([FIXTURE_ITEMS[3]])
        assert result[0]["category"] == "Performance"
        assert result[0]["severity_rating"] == 4  # Contains "major"

    def test_other_item_categorization(self):
        """Test that unmatched item is categorized as Other."""
        result = transform_to_schema([FIXTURE_ITEMS[4]])
        assert result[0]["category"] == "Other"
        assert result[0]["severity_rating"] == 2  # Default

    def test_empty_input(self):
        """Test that empty input returns empty list."""
        result = transform_to_schema([])
        assert result == []

    def test_field_mapping(self):
        """Test that fields are correctly mapped from input to output."""
        result = transform_to_schema([FIXTURE_ITEMS[0]])
        record = result[0]
        assert record["date"] == FIXTURE_ITEMS[0]["date"]
        assert record["subreddit"] == FIXTURE_ITEMS[0]["subreddit"]
        assert record["post_title"] == FIXTURE_ITEMS[0]["title"]
        assert record["post_url"] == FIXTURE_ITEMS[0]["full_link"]
        assert record["comment_or_content"] == FIXTURE_ITEMS[0]["selftext"]
        assert record["notes"] == ""

    def test_pain_summary_generated(self):
        """Test that pain_summary is generated from title and selftext."""
        result = transform_to_schema([FIXTURE_ITEMS[0]])
        record = result[0]
        assert record["pain_summary"] is not None
        assert len(record["pain_summary"]) > 0

    def test_handles_missing_fields(self):
        """Test that function handles items with missing fields gracefully."""
        incomplete_item = {
            "title": "Test title",
            # Missing other fields
        }
        result = transform_to_schema([incomplete_item])
        assert len(result) == 1
        assert result[0]["post_title"] == "Test title"
        assert result[0]["comment_or_content"] is None
