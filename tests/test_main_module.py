from src.main import _parse_subreddits


def test_parse_subreddits_handles_r_prefix_and_commas():
    assert _parse_subreddits("r/SaaS,startups") == ["SaaS", "startups"]
    assert _parse_subreddits("SaaS, r/ProductManagement , ") == ["SaaS", "ProductManagement"]
    assert _parse_subreddits("") == []
