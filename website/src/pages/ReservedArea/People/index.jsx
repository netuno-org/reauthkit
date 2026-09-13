import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Input, Card, Avatar, Badge, Pagination, Spin, Empty, Row, Col } from "antd";
import {
  SearchOutlined,
  UserOutlined
} from "@ant-design/icons";
import _service from "@netuno/service-client";
import globalNotification from "../../../common/globalNotification.js";
import "./index.less";

const { Title, Paragraph, Text } = Typography;

function People() {
  const navigate = useNavigate();
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const fetchPeople = useCallback((currentPage = 1, searchQuery = "") => {
    setLoading(true);
    _service({
      method: "POST",
      url: "/people/list",
      data: {
        page: currentPage,
        pageSize: pageSize,
        search: searchQuery
      },
      success: (response) => {
        setLoading(false);
        if (response.json) {
          setPeople(response.json.items || []);
          setTotal(response.json.total || 0);
          setPage(response.json.page || 1);
        } else {
          setPeople([]);
          setTotal(0);
        }
      },
      fail: (e) => {
        setLoading(false);
        console.error("Erro ao carregar lista de pessoas:", e);
        globalNotification.serviceFail({
          title: "Pessoas",
          description: "Não foi possível carregar a lista de pessoas.",
        });
      }
    });
  }, [pageSize]);

  useEffect(() => {
    fetchPeople(page, search);
  }, [page, fetchPeople]);

  const handleSearch = (value) => {
    setPage(1);
    fetchPeople(1, value);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div className="people-page">
      <div className="people-page__header">
        <Title level={2} className="people-page__title">Pessoas</Title>
        <Paragraph className="people-page__subtitle">
          Encontre e acompanhe os perfis da comunidade. Use a busca para filtrar.
        </Paragraph>
      </div>

      <div className="people-page__filter-card">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={16} md={12}>
            <Input.Search
              placeholder="Buscar por nome..."
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onSearch={handleSearch}
              className="people-page__search-input"
            />
          </Col>
        </Row>
      </div>

      <div className="people-page__count">
        <Text type="secondary">
          {total} {total === 1 ? "Perfil Encontrado" : "Perfis Encontrados"}
        </Text>
      </div>

      <div className="people-page__content">
        {loading ? (
          <div className="people-page__loading">
            <Spin size="large" />
          </div>
        ) : people.length === 0 ? (
          <Card className="people-page__empty-card">
            <Empty description="Nenhum utilizador encontrado." />
          </Card>
        ) : (
          <div className="people-page__list">
            {people.map((person) => {
              const avatarUrl = person.avatar
                ? _service.url(`/profile/avatar?uid=${person.uid}&${new Date().getTime()}`)
                : "/images/profile-default.png";

              return (
                <Card
                  key={person.uid}
                  className="people-page__card"
                  hoverable
                  onClick={() => navigate(`/profile/${person.uid}`)}
                >
                  <div className="people-page__card-inner">
                    <div className="people-page__card-avatar">
                      <Badge
                        dot={person.online}
                        color="#52c41a"
                        offset={[-6, 62]}
                        style={{ width: 12, height: 12, borderRadius: "50%", boxShadow: "0 0 0 2px #fff" }}
                      >
                        <Avatar
                          size={72}
                          src={avatarUrl}
                          icon={<UserOutlined />}
                          className="people-page__avatar-img"
                        />
                      </Badge>
                    </div>

                    <div className="people-page__card-details">
                      <div className="people-page__name-text">{person.name}</div>
                      {person.email && (
                        <div className="people-page__email-text">{person.email}</div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {total > pageSize && (
          <div className="people-page__pagination">
            <Pagination
              current={page}
              pageSize={pageSize}
              total={total}
              onChange={handlePageChange}
              showSizeChanger={false}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default People;
